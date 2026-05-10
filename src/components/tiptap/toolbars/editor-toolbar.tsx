import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToolbarProvider } from "./toolbar-provider";
import { Editor } from "@tiptap/core";
import { BoldToolbar } from "./bold";
import { ItalicToolbar } from "./italic";
import { UnderlineToolbar } from "./underline";
import { LinkToolbar } from "./link";
import { BulletListToolbar } from "./bullet-list";
import { OrderedListToolbar } from "./ordered-list";
import { SearchAndReplaceToolbar } from "./search-and-replace-toolbar";

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="bg-background sticky top-0 z-20 hidden w-full border-b sm:block">
      <ToolbarProvider editor={editor}>
        <TooltipProvider>
          <ScrollArea className="h-fit py-0.5">
            <div>
              <div className="flex items-center gap-0.5 px-1">
                {/* Formatting */}
                <BoldToolbar />
                <ItalicToolbar />
                <UnderlineToolbar />
                <Separator orientation="vertical" className="mx-1" />

                {/* Lists */}
                <BulletListToolbar />
                <OrderedListToolbar />
                <Separator orientation="vertical" className="mx-1" />

                {/* Tools */}
                <LinkToolbar />
                <div className="flex-1" />
                <SearchAndReplaceToolbar />
              </div>
            </div>
            <ScrollBar className="hidden" orientation="horizontal" />
          </ScrollArea>
        </TooltipProvider>
      </ToolbarProvider>
    </div>
  );
};
