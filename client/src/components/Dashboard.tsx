import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shadcn/components/ui/resizable";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";

import Editor from "@monaco-editor/react";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "@/context/MainContext";
import { TestRun } from "@/models/TestRun";
import TestRunTable from "./TestRunTable";
import TestAlert from "./TestAlert";
import { Check } from "@/models/Check";
import TestCreator from "./TestCreator";
import { Switch } from "@/shadcn/components/ui/switch";
import { Label } from "@/shadcn/components/ui/label";
import { generateCode } from "@/utils/generateCode";
import { Test } from "@/models/Statement";
import { setupEditor } from "@/utils/setupEditor";
import { parseCode } from "@/utils/parseCode";

type Props = { checks: Check[]; rerunHandler: (id: number) => void };

function Dashboard({ checks, rerunHandler }: Props) {
  const { code, setCode, fileName } = useContext(MainContext);
  const [tests, setTests] = useState<Test[]>([]);
  const [isCode, setIsCode] = useState<boolean>(false);

  const [testRuns, setTestRuns] = useState<TestRun[]>([]);

  async function getTestRuns(fileName: string) {
    try {
      const res = await fetch(
        `http://localhost:5064/api/tests/${fileName}/runs`
      );
      const testRuns: TestRun[] = await res.json();
      console.log(testRuns);
      setTestRuns(testRuns);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (fileName) getTestRuns(fileName);
  }, [fileName]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full rounded-lg"
    >
      <ResizablePanel className="flex flex-col gap-3 px-3">
        <div className="flex flex-row gap-3 items-center">
          <Switch
            id="code-toggle"
            checked={isCode}
            onCheckedChange={(checked) => {
              if (checked) setCode(generateCode(tests));
              else setTests(parseCode(code));
              setIsCode(checked);
            }}
          />
          <Label htmlFor="code-toggle">
            {isCode ? "Use visual editor" : "Use code editor"}
          </Label>
        </div>
        {isCode ? (
          <Editor
            height="100%"
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 14,
            }}
            language={"rnl"}
            className="editor-wrapper"
            theme={"rnl-theme"}
            value={code}
            onChange={(c) => setCode(c ?? "")}
            beforeMount={setupEditor}
          />
        ) : (
          <TestCreator defaultTests={tests} onChange={setTests} />
        )}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel className="flex flex-col gap-3 p-3" defaultSize={60}>
            <TestRunTable testRuns={testRuns} rerunHandler={rerunHandler} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} className="p-3 flex flex-col gap-3">
            <h1 className="font-bold text-2xl">Tests</h1>
            <ScrollArea className="h-full w-full">
              {checks.length === 0 && (
                <p>There are no tests running yet. Try running a test first!</p>
              )}
              <div className="flex flex-col gap-3">
                <TestAlert checks={checks} />
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Dashboard;
