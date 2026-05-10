"use client";

import { BubbleMenu } from "@tiptap/react/menus";
import { type Editor } from "@tiptap/react";
import { BoldToolbar } from "../toolbars/bold";
import { ItalicToolbar } from "../toolbars/italic";
import { UnderlineToolbar } from "../toolbars/underline";
import { LinkToolbar } from "../toolbars/link";
import { SearchAndReplaceToolbar } from "../toolbars/search-and-replace-toolbar";
import { ToolbarProvider } from "../toolbars/toolbar-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-querry";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BulletListToolbar } from "../toolbars/bullet-list";
import { OrderedListToolbar } from "../toolbars/ordered-list";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function FloatingToolbar({ editor }: { editor: Editor | null }) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Prevent default context menu on mobile
  useEffect(() => {
    if (!editor?.options.element || !isMobile) return;

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    const el = editor.view.dom;
    el.addEventListener("contextmenu", handleContextMenu);

    return () => el.removeEventListener("contextmenu", handleContextMenu);
  }, [editor, isMobile]);

  if (!editor) return null;

  return (
    <TooltipProvider>
      <BubbleMenu
        options={{
          placement: "top",
          offset: 10,
        }}
        shouldShow={({ state }) => {
          return !state.selection.empty;
        }}
        editor={editor}
        className={cn(
          "bg-background flex items-center gap-0.5 rounded-md border p-1 shadow-md",
          isMobile && "mx-0 w-full min-w-full rounded-sm shadow-sm",
        )}
      >
        <ToolbarProvider editor={editor}>
          <div className="flex items-center gap-0.5">
            {/* Formatting */}
            <BoldToolbar />
            <ItalicToolbar />
            <UnderlineToolbar />
            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Lists */}
            <BulletListToolbar />
            <OrderedListToolbar />
            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Link & Search */}
            <LinkToolbar />
            <SearchAndReplaceToolbar />
          </div>
        </ToolbarProvider>
      </BubbleMenu>
    </TooltipProvider>
  );
}
