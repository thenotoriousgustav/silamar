"use client";

import { HistoryExtension } from "@lexical/history";
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
  configExtension,
  defineExtension,
  type EditorState,
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
  // $initialEditorState accepts: null | string (JSON) | EditorState | ((editor) => void)
  const resolvedInitialState = useMemo((): string | EditorState | null => {
    // If a serialized state object is provided, stringify it for Lexical
    if (editorSerializedState) {
      return JSON.stringify(editorSerializedState);
    }
    // If initialDescription is a JSON string of SerializedEditorState, pass directly
    if (initialDescription) {
      try {
        const parsed = JSON.parse(initialDescription);
        if (parsed && parsed.root) {
          return initialDescription; // valid Lexical JSON string
        }
      } catch {
        // Not valid JSON — editor will start empty
      }
    }
    // If an EditorState object is provided
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
