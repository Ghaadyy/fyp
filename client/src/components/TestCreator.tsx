import StatementCreator from "@/components/StatementCreator";
import { Button } from "@/shadcn/components/ui/button";
import { useContext, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/shadcn/components/ui/dialog";
import { Input } from "@/shadcn/components/ui/input";
import { useToast } from "@/shadcn/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/shadcn/components/ui/scroll-area";
import { EditorContext } from "@/context/EditorContext";

function AddTestDialog() {
  const { toast } = useToast();

  const [testName, setTestName] = useState<string>("");
  const { setTests } = useContext(EditorContext);

  return (
    <div className="self-end flex flex-row gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add test</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What is the test's name?</DialogTitle>
            <DialogDescription>
              Enter a name to create your test.
            </DialogDescription>
            <Input
              placeholder="Test name..."
              onChange={(e) => setTestName(e.target.value)}
              value={testName}
            />
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  if (testName === "") {
                    toast({
                      title: "Test Name cannot be empty!",
                    });
                    return;
                  }
                  setTests((prevTests) => {
                    const updated = [
                      ...prevTests,
                      {
                        name: testName,
                        statements: [],
                      },
                    ];
                    return updated;
                  });
                  setTestName("");
                }}
              >
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TestCreator({ statementId }: { statementId: number }) {
  const { tests, setTests } = useContext(EditorContext);

  return (
    <>
      <ScrollArea className="w-full">
        <div className="w-full flex flex-col gap-3">
          {tests.map((test, id) => (
            <div
              key={id}
              className="rounded-md bg-transparent border-input border-2 border-solid p-3 flex flex-col gap-3"
            >
              <h1 className="font-bold">{test.name}</h1>
              <StatementCreator
                defaultStatements={test.statements}
                onChange={(newStatements) =>
                  setTests((prevTests) => {
                    const updatedTests = [...prevTests];
                    updatedTests[id].statements = newStatements;
                    return updatedTests;
                  })
                }
                statementId={statementId}
                onDelete={() =>
                  setTests((prevTests) =>
                    prevTests.filter((t) => t.name !== test.name)
                  )
                }
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <AddTestDialog />
    </>
  );
}

export default TestCreator;
