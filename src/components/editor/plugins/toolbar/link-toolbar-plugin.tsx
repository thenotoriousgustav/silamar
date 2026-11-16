import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isRangeSelection, type BaseSelection } from "lexical";
import { LinkIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import { getSelectedNode } from "@/components/editor/utils/get-selected-node";
import { sanitizeUrl } from "@/components/editor/utils/url";
import { Toggle } from "@/components/ui/toggle";

export function LinkToolbarPlugin({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: (isEditMode: boolean) => void;
}) {
  const { activeEditor } = useToolbarContext();
  const [isLink, setIsLink] = useState(false);

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl("https://"),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, setIsLinkEditMode]);

  return (
    <Toggle
      variant={"outline"}
      size="sm"
      aria-label="Toggle link"
      onClick={insertLink}
    >
      <LinkIcon className="h-4 w-4" />
    </Toggle>
  );
}
