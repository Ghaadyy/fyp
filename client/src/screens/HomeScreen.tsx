import FilesTable from "@/components/FilesTable";
import { UserContext } from "@/context/UserContext";
import { API_URL } from "@/main";
import { TestFile } from "@/models/TestFile";
import { useContext, useEffect, useState } from "react";

function useTests() {
  const { token } = useContext(UserContext);
  const [tests, setTests] = useState<TestFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/api/tests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tests: TestFile[] = await res.json();
      setTests(tests);
      setIsLoading(false);
    })();
  }, [token]);

  return { tests, isLoading };
}

function HomeScreen() {
  const { tests, isLoading } = useTests();

  return isLoading ? <h1>Loading...</h1> : <FilesTable tests={tests!} />;
}

export default HomeScreen;
