import { useEffect } from "react";
import { NotesList } from "components";
import { useNotes } from "contexts/";
import { useDocumentTitle } from "custom-hook";
import "./labels.css";

const Labels = () => {
  const { archives, notes, labels, notesStateError, notesStateLoading } =
    useNotes();

  const setDocumentTitle = useDocumentTitle();

  useEffect(() => {
    setDocumentTitle("Inscribe | Labels");
  }, []);

  const labelledNotes = labels?.map(({ label, id }) => {
    const notesWithLabel = notes?.reduce(
      (noteAccum, currentNote) =>
        currentNote?.tags?.find((tag) => tag.id === id)
          ? [...noteAccum, currentNote]
          : [...noteAccum],
      []
    );
    const archivesWithLabel = archives?.reduce(
      (archiveAccum, currentArchive) =>
        currentArchive?.tags?.find((tag) => tag.id === id)
          ? [...archiveAccum, currentArchive]
          : [...archiveAccum],
      []
    );

    return { id, label, notesWithLabel, archivesWithLabel };
  });

  const loadingMessage = (
    <div className="message">
      <p className="success-color text-lg my-1">Loading Labelled Notes...</p>
    </div>
  );

  const errorMessage = (
    <div className="message">
      <p className="error-color text-lg my-1">{notesStateError}</p>
    </div>
  );

  return (
    <section className="section-wrapper flex-col flex-align-center flex-justify-start labels-section">
      {notesStateLoading ? (
        loadingMessage
      ) : notesStateError ? (
        errorMessage
      ) : labelledNotes?.length ? (
        labelledNotes?.map(
          ({ label, notesWithLabel, id, archivesWithLabel }) => (
            <div
              className="label-list-wrapper mx-auto text-left"
              id={id}
              key={id}
            >
              <h3 className="label-head mb-0-25">{label}</h3>
              {notesWithLabel?.length > 0 ? (
                <div className="note-list-wrapper">
                  {<NotesList notes={notesWithLabel} />}
                </div>
              ) : (
                <p>You don't have any notes under this label!</p>
              )}
              {archivesWithLabel?.length > 0 && (
                <div className="archived-list-wrapper my-1-5">
                  <h6 className="label-sub-head mb-0-75">Archived</h6>

                  {<NotesList notes={archivesWithLabel} />}
                </div>
              )}
            </div>
          )
        )
      ) : (
        <p className="text-lg text-center">You have not created any labels!</p>
      )}
    </section>
  );
};

export { Labels };
