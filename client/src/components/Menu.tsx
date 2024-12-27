import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/shadcn/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/shadcn/components/ui/dialog";
import { Input } from "@/shadcn/components/ui/input";
import { Button } from "@/shadcn/components/ui/button";
import { useContext, useState } from "react";
import { MainContext } from "@/context/MainContext";
import { useTheme } from "@/shadcn/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router";

type Props = {
  onRun: () => void;
  onSave: (fileName: string) => void;
};

function Menu({ onRun, onSave }: Props) {
  const { fileName } = useContext(MainContext);

  const [saveFileName, setSaveFileName] = useState<string>("");

  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-row gap-3">
      <Menubar className="flex-1">
        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/">Home</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          {fileName ? (
            <MenubarMenu>
              <MenubarTrigger onClick={() => onSave(fileName)}>
                Save
              </MenubarTrigger>
            </MenubarMenu>
          ) : (
            <Dialog>
              <MenubarMenu>
                <MenubarTrigger>
                  <DialogTrigger>Save</DialogTrigger>
                </MenubarTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save file</DialogTitle>
                    <DialogDescription>
                      Enter a file name to save your progress.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Input
                      placeholder="File Name...."
                      value={saveFileName}
                      onChange={(e) => setSaveFileName(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose>
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => onSave(saveFileName)}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </MenubarMenu>
            </Dialog>
          )}
          <MenubarMenu>
            <MenubarTrigger onClick={onRun} disabled={!fileName}>
              Run
            </MenubarTrigger>
          </MenubarMenu>
        </MenubarMenu>
      </Menubar>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}

export default Menu;
