import {
  type Dispatch,
  type JSX,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isLineBreakNode,
  $isNodeSelection,
  $isRangeSelection,
  type BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  type LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

import { Check, Pencil, Trash, X } from "lucide-react";

import { getSelectedNode } from "@/components/editor/utils/get-selected-node";
import { setFloatingElemPositionForLinkEditor } from "@/components/editor/utils/set-floating-elem-position-for-link-editor";
import { sanitizeUrl } from "@/components/editor/utils/url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function FloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [editedLinkUrl, setEditedLinkUrl] = useState("https://");
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null);

  // Keep refs in sync so $updateLinkEditor can read latest values
  // without those values appearing in useCallback deps.
  const isLinkEditModeRef = useRef(isLinkEditMode);
  const linkUrlRef = useRef(linkUrl);
  const setIsLinkEditModeRef = useRef(setIsLinkEditMode);
  const anchorElemRef = useRef(anchorElem);

  useEffect(() => { isLinkEditModeRef.current = isLinkEditMode; });
  useEffect(() => { linkUrlRef.current = linkUrl; });
  useEffect(() => { setIsLinkEditModeRef.current = setIsLinkEditMode; });
  useEffect(() => { anchorElemRef.current = anchorElem; });

  // Stable callback — no state/prop values in deps, all read via refs.
  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        setLinkUrl(linkParent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
      if (isLinkEditModeRef.current) {
        setEditedLinkUrl(linkUrlRef.current);
      }
    }

    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) return;

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      if (domRect) {
        domRect.y += 40;
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElemRef.current);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElemRef.current);
      }
      setLastSelection((prev) => prev === null ? prev : null);
      // Only call setState if value is actually changing — prevents infinite loop
      if (isLinkEditModeRef.current) {
        setIsLinkEditModeRef.current(false);
      }
      setLinkUrl((prev) => prev === "" ? prev : "");
    }
  }, [editor]); // only editor — everything else via refs

  // Scroll / resize listener
  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;
    const update = () => {
      editor.getEditorState().read(() => { $updateLinkEditor(); });
    };
    window.addEventListener("resize", update);
    scrollerElem?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      scrollerElem?.removeEventListener("scroll", update);
    };
  }, [anchorElem.parentElement, editor, $updateLinkEditor]);

  // Editor update + command listeners
  const isLinkRef = useRef(isLink);
  const setIsLinkRef = useRef(setIsLink);
  useEffect(() => { isLinkRef.current = isLink; });
  useEffect(() => { setIsLinkRef.current = setIsLink; });

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => { $updateLinkEditor(); });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLinkRef.current) {
            setIsLinkRef.current(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, $updateLinkEditor]);

  // Initial read
  useEffect(() => {
    editor.getEditorState().read(() => { $updateLinkEditor(); });
  }, [editor, $updateLinkEditor]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus();
      setIsLink(true);
    }
  }, [isLinkEditMode, setIsLink]);

  const monitorInputInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLinkSubmission();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsLinkEditMode(false);
    }
  };

  const handleLinkSubmission = () => {
    if (lastSelection !== null) {
      if (linkUrl !== "") {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl));
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent();
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title,
              });
              parent.replace(linkNode, true);
            }
          }
        });
      }
      setEditedLinkUrl("https://");
      setIsLinkEditMode(false);
    }
  };

  return (
    <div
      ref={editorRef}
      className="absolute top-0 left-0 w-full max-w-sm rounded-md opacity-0 shadow-md"
    >
      {!isLink ? null : isLinkEditMode ? (
        <div className="flex items-center space-x-2 rounded-md border bg-background p-1 pl-2">
          <Input
            ref={inputRef}
            value={editedLinkUrl}
            onChange={(event) => setEditedLinkUrl(event.target.value)}
            onKeyDown={monitorInputInteraction}
            className="flex-grow"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setIsLinkEditMode(false);
              setIsLink(false);
            }}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={handleLinkSubmission} className="shrink-0">
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-md border bg-background p-1 pl-2">
          <a
            href={sanitizeUrl(linkUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="overflow-hidden text-sm text-ellipsis whitespace-nowrap"
          >
            {linkUrl}
          </a>
          <div className="flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setEditedLinkUrl(linkUrl);
                setIsLinkEditMode(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLDivElement | null,
  isLinkEditMode: boolean,
  setIsLinkEditMode: Dispatch<boolean>,
): JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    function $updateToolbar() {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection);
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode);
        const focusAutoLinkNode = $findMatchingParent(focusNode, $isAutoLinkNode);
        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false);
          return;
        }
        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode);
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode &&
                (!autoLinkNode.is(focusAutoLinkNode) ||
                  autoLinkNode.getIsUnlinked()))
            );
          });
        setIsLink(!badNode);
      } else if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        if (nodes.length === 0) { setIsLink(false); return; }
        const node = nodes[0];
        const parent = node.getParent();
        setIsLink($isLinkNode(parent) || $isLinkNode(node));
      }
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => { $updateToolbar(); });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), "_blank");
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  if (!anchorElem) return null;

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      anchorElem={anchorElem}
      setIsLink={setIsLink}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem,
  );
}

export function FloatingLinkEditorPlugin({
  anchorElem,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  anchorElem: HTMLDivElement | null;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingLinkEditorToolbar(editor, anchorElem, isLinkEditMode, setIsLinkEditMode);
}
