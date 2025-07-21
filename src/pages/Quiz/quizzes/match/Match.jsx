import "./Match.css";
import { useEffect, useRef, useState } from "react";

function Match({ question, setSelectedAnswer, plusScore }) {
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [shuffledDefs, setShuffledDefs] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedDef, setSelectedDef] = useState(null);
  const [matched, setMatched] = useState([]);
  const [mismatched, setMismatched] = useState(null);
  const isScore = useRef(false);

  useEffect(() => {
    const terms = [...question.options].sort(() => 0.5 - Math.random());
    const defs = [...question.options].sort(() => 0.5 - Math.random());
    setShuffledTerms(terms);
    setShuffledDefs(defs);

    setSelectedAnswer(null);
    setSelectedTerm(null);
    setSelectedDef(null);
    setMatched([]);
    setMismatched(null);
    isScore.current = false;
  }, [question]);

  useEffect(() => {
    if (selectedTerm && selectedDef) {
      const correct = question.options.find(
        (o) => o.term === selectedTerm && o.definition === selectedDef
      );
      if (correct) {
        setMatched((prev) => [
          ...prev,
          { term: selectedTerm, definition: selectedDef },
        ]);
      } else {
        setMismatched({ term: selectedTerm, definition: selectedDef });
        isScore.current = true;
      }

      setTimeout(() => {
        setSelectedTerm(null);
        setSelectedDef(null);
        setMismatched(null);
      }, 200);
    }
  }, [selectedTerm, selectedDef]);

  const isMatched = (option) =>
    matched.some((o) => o.term === option || o.definition === option);

  useEffect(() => {
    const finished = matched.length === question.options.length;
    if (finished) {
      setSelectedAnswer(1);
      if (finished && mismatched === null && !isScore.current) {
        console.log("+");
        plusScore();
        isScore.current = true;
      }
    }
  }, [matched]);

  return (
    <div className="match_container flex-col">
      <div className="quiz_question">{question.question}</div>
      <div className="match_options_container">
        <div className="terms_container flex-col">
          {shuffledTerms.map(({ term }) => (
            <button
              key={term}
              className={`quiz_option ${isMatched(term) ? "disable" : ""} ${
                mismatched && mismatched.term === term ? "danger" : ""
              } ${selectedTerm === term && !mismatched ? "selected" : ""}`}
              onClick={() => {
                if (selectedTerm !== term) setSelectedTerm(term);
                else setSelectedTerm(null);
              }}
            >
              {term}
            </button>
          ))}
        </div>
        <div className="defs_container flex-col">
          {shuffledDefs.map(({ definition }) => (
            <button
              key={definition}
              className={`quiz_option ${
                isMatched(definition) ? "disable" : ""
              } ${
                mismatched && mismatched.definition === definition
                  ? "danger"
                  : ""
              } ${selectedDef === definition && !mismatched ? "selected" : ""}`}
              onClick={() => {
                if (selectedDef !== definition) setSelectedDef(definition);
                else setSelectedDef(null);
              }}
            >
              {definition}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Match;
