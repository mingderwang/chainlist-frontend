import { Suspense } from "react";
import { Provider, atom, useAtom } from "jotai";
import JSONPretty from 'react-json-pretty';

const postId = atom(0);
const postData = atom(async (get) => {
  const id: number = get(postId);
  const response = await fetch(
    `https://example-steel-ten.vercel.app/api/v1/chainlist/${id}`
  );
  return await response.json();
});

function Next() {
  const [, set] = useAtom(postId);
  return (
    <>
    <button onClick={() => set((x) => x + 1)}>
      <div>👉</div>
    </button>
    </>
  );
}

function PostTitle() {
  // This throws an expection that's caught by Reacts suspense boundary
  const [{ meta }] = useAtom(postData);
  // And by the time we're here the data above is available
  return (
    <>
      <h1> {meta.id}</h1>
      <h2>🦄 {meta.name}</h2>
      <a target="_blank" href={`${meta.blockExplorers.default.url}`}>
      {meta.blockExplorers.default.url}
      </a>
      <JSONPretty id="json-pretty" data={meta.nativeCurrency}></JSONPretty>
    </>
  );
}

export default function App() {
  return (
    <>
    <Provider>
      <Next />
      <div>
        <Suspense fallback={<h2>Loading...</h2>}>
          <PostTitle />
        </Suspense>
      </div>
    </Provider>
    </>
  );
}