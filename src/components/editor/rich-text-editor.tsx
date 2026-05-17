"use client";

import { HistoryExtension } from "@lexical/history";
import { $generateNodesFromDOM } from "@lexical/html";
import {
  AutoLinkExtension,
  ClickableLinkExtension,
  LinkExtension,
} from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { RichTextExtension } from "@lexical/rich-text";
import {
  $getRoot,
  configExtension,
  defineExtension,
  type EditorState,
  type LexicalEditor,
  type SerializedEditorState,
} from "lexical";
import { useMemo, useState } from "react";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { DragDropPasteExtension } from "@/components/editor/extensions/drag-drop-paste-extension";
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin";
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin";
import { BulletedListPickerPlugin } from "@/components/editor/plugins/picker/bulleted-list-picker-plugin";
import { NumberedListPickerPlugin } from "@/components/editor/plugins/picker/numbered-list-picker-plugin";
import { ParagraphPickerPlugin } from "@/components/editor/plugins/picker/paragraph-picker-plugin";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { ResumeFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/resume-format-toolbar-plugin";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { validateUrl } from "@/components/editor/utils/url";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Editor({
  editorState,
  editorSerializedState,
  initialDescription,
  onChange,
  onSerializedChange,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  initialDescription?: string;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const blockPickerOptions = useMemo(
    () => [
      ParagraphPickerPlugin(),
      BulletedListPickerPlugin(),
      NumberedListPickerPlugin(),
    ],
    [],
  );

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  // Resolve the initial editor state for Lexical.
  // $initialEditorState accepts: null | string (Lexical JSON) | EditorState | ((editor) => void)
  // We support 3 input formats:
  //   1. Lexical JSON string (from previous save) → pass as JSON string
  //   2. HTML string (from old data or array conversion) → pass function that converts via DOMParser
  //   3. EditorState object → pass directly
  const resolvedInitialState = useMemo(():
    | string
    | EditorState
    | ((editor: LexicalEditor) => void)
    | null => {
    // Case A: serialized state object provided
    if (editorSerializedState) {
      return JSON.stringify(editorSerializedState);
    }

    // Case B: initialDescription string — could be Lexical JSON or HTML
    if (initialDescription) {
      // Try parse as Lexical JSON first
      try {
        const parsed = JSON.parse(initialDescription);
        if (parsed && parsed.root) {
          return initialDescription; // valid Lexical JSON
        }
      } catch {
        // Not JSON — fall through to HTML handling
      }

      // Treat as HTML: build state via function initializer
      const html = initialDescription;
      return (editor: LexicalEditor) => {
        const parser = new DOMParser();
        // Wrap plain text in <p> so DOMParser produces block-level elements
        // that Lexical can accept as root children.
        const wrappedHtml = html.includes("<") ? html : `<p>${html}</p>`;
        const dom = parser.parseFromString(wrappedHtml, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        // Filter: only append element or decorator nodes (Lexical root
        // rejects raw text nodes).
        const validNodes = nodes.filter(
          (node) => node.getType() !== "text" && node.getType() !== "linebreak",
        );
        if (validNodes.length > 0) {
          root.append(...validNodes);
        }
      };
    }

    // Case C: EditorState object
    if (editorState) {
      return editorState;
    }

    return null;
  }, [editorSerializedState, initialDescription, editorState]);

  const AppExtension = useMemo(
    () =>
      defineExtension({
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          configExtension(LinkExtension, {
            validateUrl,
            attributes: { rel: "noopener noreferrer", target: "_blank" },
          }),
          AutoLinkExtension,
          ClickableLinkExtension,
          configExtension(ListExtension, { shouldPreserveNumbering: false }),
          CheckListExtension,
          DragDropPasteExtension,
        ],
        name: "@resume-editor",
        namespace: "ResumeEditor",
        nodes: [],
        $initialEditorState: resolvedInitialState,
        theme: editorTheme,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border shadow">
      <LexicalExtensionComposer extension={AppExtension} contentEditable={null}>
        <TooltipProvider>
          <ToolbarPlugin>
            {() => (
              <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b p-1">
                {/* Undo / Redo */}
                <HistoryToolbarPlugin />

                {/* Block format: Paragraph / Bullet list / Numbered list */}
                <BlockFormatDropDown>
                  <FormatParagraph />
                  <FormatBulletedList />
                  <FormatNumberedList />
                </BlockFormatDropDown>

                {/* Bold + Underline */}
                <ResumeFormatToolbarPlugin />

                {/* Link */}
                <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
              </div>
            )}
          </ToolbarPlugin>

          <div className="relative" ref={onRef}>
            <ContentEditable
              placeholder="Tulis deskripsi..."
              className="px-14 my-4"
              placeholderClassName="px-14 my-2"
            />
            <TabIndentationPlugin />
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} baseOptions={blockPickerOptions} />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </div>

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalExtensionComposer>
    </div>
  );
}
