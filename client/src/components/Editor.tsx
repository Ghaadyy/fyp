import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shadcn/components/ui/resizable";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useContext, useEffect, useState } from "react";
import { EditorContext } from "@/context/EditorContext";
import TestLogs from "./TestLogs";
import TestCreator from "./TestCreator";
import { Switch } from "@/shadcn/components/ui/switch";
import { Label } from "@/shadcn/components/ui/label";
import { generateCode } from "@/utils/generateCode";
import { setupEditor } from "@/utils/setupEditor";
import { parseCode } from "@/utils/parseCode";
import { toast } from "@/shadcn/hooks/use-toast";
import { TestFile } from "@/models/TestFile";
import { UserContext } from "@/context/UserContext";
import { API_URL } from "@/main";
import { LogGroup } from "@/models/Log";
import { Card } from "@/shadcn/components/ui/card";

type Props = { logs: LogGroup[] };

async function openDocument(
  fileId: string,
  token: string,
  onSuccess: (file: TestFile) => void,
  onError?: (err?: unknown) => void
) {
  try {
    const res = await fetch(`${API_URL}/api/tests/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (onError) onError();
      return;
    }

    const file: TestFile = await res.json();
    onSuccess(file);
  } catch (err) {
    if (onError) onError(err);
  }
}

function Editor({ logs }: Props) {
  const { code, setCode, tests, setTests, isCode, setIsCode, fileId } =
    useContext(EditorContext);
  const { token } = useContext(UserContext);

  const [statementId, setStatementId] = useState<number>(1);

  function handleEditorSwitch(checked: boolean) {
    if (checked) {
      setCode(generateCode(tests));
      setIsCode(checked);
    } else {
      const [parsedTests, status] = parseCode(code);
      if (!status) {
        toast({
          title: "Test contains syntax errors!",
          variant: "destructive",
          description:
            "Please fix these errors before switching to the UI editor.",
        });
        setIsCode(true);
      } else {
        setTests(parsedTests);
        setIsCode(checked);
      }
    }
  }

  useEffect(() => {
    openDocument(fileId, token!, ({ content }) => {
      const [parsedTests, , nextId] = parseCode(content);
      setCode(content);
      setTests(parsedTests);
      setStatementId(nextId);
      toast({
        title: "File opened successfully",
      });
    });
  }, [fileId, setCode, setTests, token]);

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel className="flex flex-col gap-3 py-3" defaultSize={80}>
        <div className="flex flex-row gap-3 items-center">
          <Switch
            id="code-toggle"
            checked={isCode}
            onCheckedChange={handleEditorSwitch}
          />
          <Label htmlFor="code-toggle">
            {isCode ? "Use visual editor" : "Use code editor"}
          </Label>
        </div>
        {isCode ? (
          <MonacoEditor
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
          <TestCreator statementId={statementId} />
        )}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20} className="py-3">
        <Card className="p-4 flex flex-col gap-3 h-full w-full">
          <h1 className="font-bold text-2xl">Logs</h1>
          <TestLogs logs={logs} />
        </Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Editor;
