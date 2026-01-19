import parse from "html-react-parser";

// ---------- safe helpers ----------
const safeArray = (v) => (Array.isArray(v) ? v : []);
const safeStr = (v) => (v === null || v === undefined ? "" : String(v));

const getTitleFromItem = (item) => {
  // 다양한 케이스 대비
  return (
    item?.document?.structData?.title ??
    item?.document?.derivedStructData?.title ??
    item?.document?.title ??
    item?.document?.id ??
    ""
  );
};

const getReferencesFromResponse = (response) => {
  // summary / references / chunkContents 구조가 없는 케이스 대비
  return (
    response?.summary?.summaryWithMetadata?.references?.[0]?.chunkContents ?? []
  );
};
// ----------------------------------

const ResponseItem = (props) => {
  console.log("API pass as props", props.response);

  const results = safeArray(props?.response?.results);

  return (
    <div className="bg-gray rounded-md p-4 w-full mb-8">
      <div className="flex-col overflow-y-auto items-center justify-center">
        {results.map((item, idx) => (
          <div key={item?.id ?? item?.document?.id ?? idx}>
            {getItem(item, props.response)}
          </div>
        ))}
      </div>
    </div>
  );
};

function getItem(item, response) {
  const title = getTitleFromItem(item);
  const referenceItems = getReferencesFromResponse(response);

  const snippets = safeArray(item?.document?.derivedStructData?.snippets);
  const extractiveAnswers = safeArray(
    item?.document?.derivedStructData?.extractive_answers
  );
  const extractiveSegments = safeArray(
    item?.document?.derivedStructData?.extractive_segments
  );

  return (
    <div className="block bg-white rounded-md p-4 w-full mb-8">
      {getFileName(title)}

      {/* references는 response 전체에서 오는데, 지금 코드는 모든 item에 동일 references[0]만 뿌리고 있음 */}
      {referenceItems.length > 0 && getReferences(referenceItems)}

      {snippets.length > 0 && getSnippets(snippets)}
      {extractiveAnswers.length > 0 && getExtractiveAnswer(extractiveAnswers)}
      {extractiveSegments.length > 0 &&
        getExtractiveSegments(extractiveSegments)}
    </div>
  );
}

function getFileName(docTitle) {
  const t = safeStr(docTitle);
  if (!t) {
    return (
      <h3 className="text-md font-medium mb-2 text-sky-900">from: (untitled)</h3>
    );
  }

  return (
    <h3 className="text-md font-medium mb-2 text-sky-900">
      from:{" "}
      {t.includes("docs/") ? (t.split("/")[1] ?? t) : t}
    </h3>
  );
}

function getReferences(referenceItems) {
  return (
    <div className="block mt-2 mb-2">
      <h1 className="text-md font-bold">References</h1>
      <div className="block ">
        {safeArray(referenceItems).map((item, idx) => (
          <div className="block mb-2" key={idx}>
            <h1 className="text-xs font-medium text-violet-900">
              page {item?.pageIdentifier ?? "?"}
            </h1>
            <h1 className="text-sm">{safeStr(item?.content)}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSnippets(snippetItems) {
  return (
    <div className="block mt-2 mb-2">
      <h1 className="text-md font-bold">Snippets</h1>
      {safeArray(snippetItems).map((item, idx) => (
        <div className="block mb-2" key={idx}>
          <h1 className="text-sm prose">{parse(safeStr(item?.snippet))}</h1>
        </div>
      ))}
    </div>
  );
}

function getExtractiveAnswer(extractiveAnswerItems) {
  return (
    <div className="block mt-2 mb-2">
      <h1 className="text-md font-bold">Extractive Answers</h1>
      <div className="block mb-2">
        {safeArray(extractiveAnswerItems).map((item, idx) => (
          <div className="block" key={idx}>
            <h1 className="text-xs font-medium text-orange-700">
              page {item?.pageNumber ?? "?"}
            </h1>
            <h1 className="text-sm">{safeStr(item?.content)}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

function getExtractiveSegments(extractiveSegmentItems) {
  return (
    <div className="block mt-2 mb-2">
      <h1 className="text-md font-bold">Extractive Segments</h1>
      <div className="block mb-2">
        {safeArray(extractiveSegmentItems).map((item, idx) => (
          <div className="block mb-2" key={idx}>
            <div className="flex justify-between">
              <h1 className="text-xs font-medium text-orange-700">
                page {item?.pageNumber ?? "?"}
              </h1>
              <h1 className="text-xs font-medium text-green-800">
                relevance score:{" "}
                {typeof item?.relevanceScore === "number"
                  ? item.relevanceScore.toFixed(2)
                  : "?"}
              </h1>
            </div>
            <h1 className="text-sm">{safeStr(item?.content)}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponseItem;
