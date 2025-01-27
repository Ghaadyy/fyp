import Menu from "@/components/Menu";
import Editor from "@/components/Editor";
import { useState } from "react";
import { EditorContext } from "@/context/EditorContext";
import { useParams } from "react-router";
import { Test } from "@/models/Statement";
import { useTest } from "@/hooks/useTest";
import { ErrorCard } from "@/components/ErrorCard";

function EditorScreen() {
  const { testId } = useParams();

  const [fileId, setFileId] = useState<string>(testId!);
  const [code, setCode] = useState<string>("");
  const [isCode, setIsCode] = useState<boolean>(true);
  const [tests, setTests] = useState<Test[]>([]);

  const { run, errors, setErrors } = useTest();

  return (
    <EditorContext.Provider
      value={{
        fileId,
        setFileId,
        code,
        setCode,
        isCode,
        setIsCode,
        tests,
        setTests,
      }}
    >
      <div className="h-screen w-screen flex flex-col gap-3 p-3">
        <Menu onRun={async () => await run(fileId)} />
        <Editor />
      </div>

      {errors && <ErrorCard errors={errors} setErrors={setErrors} />}
    </EditorContext.Provider>
  );
}

export default EditorScreen;
