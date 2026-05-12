import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { isMimeType, mediaFileReader } from "@lexical/utils";
import { COMMAND_PRIORITY_LOW, defineExtension } from "lexical";

// NOTE: INSERT_IMAGE_COMMAND is intentionally not imported here to avoid
// pulling in images-extension.tsx which calls document.createElement at
// module evaluation time (breaks SSR / Next.js server components).

const ACCEPTABLE_IMAGE_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
];

export const DragDropPasteExtension = defineExtension({
  name: "@shadcn-editor/DragDropPaste",
  register: (editor) =>
    editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        (async () => {
          const filesResult = await mediaFileReader(
            files,
            [ACCEPTABLE_IMAGE_TYPES].flatMap((x) => x),
          );
          for (const { file } of filesResult) {
            if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
              // Image drag-drop is disabled in this editor variant.
              // To re-enable, import INSERT_IMAGE_COMMAND from images-extension
              // and dispatch it here — but note that images-extension.tsx uses
              // document.createElement at module level which breaks SSR.
              console.warn(
                "[DragDropPaste] Image drop ignored (images-extension disabled):",
                file.name,
              );
            }
          }
        })();
        return true;
      },
      COMMAND_PRIORITY_LOW,
    ),
});
