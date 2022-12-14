import { useRef, useState } from "react";
import { FilterAltSharp } from "@mui/icons-material";

import { useNotes } from "contexts";
import { FilterDrawerPortal } from "./FilterDrawer/FilterDrawerPortal";
import "./search-bar.css";

const SearchBar = ({ noteType }) => {
  const {
    searchText,
    handleChangeSearchText,
    archives,
    notes,
    sortBy,
    filterByLabel,
    notesDispatch,
    filterByPriority,
  } = useNotes();

  const { sortByDate, sortByPriority } = sortBy;

  const [showFilterModal, setShowFilterModal] = useState(false);

  const displayNotes = noteType === "archives" ? archives : notes;

  const handleChangeShowFilterModal = (action) => {
    switch (action) {
      case "CLOSE_FILTER_MODAL":
        setShowFilterModal(false);
        break;
      case "OPEN_FILTER_MODAL":
        setShowFilterModal(true);
        break;
    }
  };

  const handleClearFilters = () =>
    notesDispatch({
      action: {
        type: "RESET_FILTERS",
        payload: {
          sortBy: { sortByDate: "", sortByPriority: "" },
          filterByLabel: filterByLabel.map((filter) => ({
            ...filter,
            filtered: false,
          })),
          filterByPriority: filterByPriority.map((filter) => ({
            ...filter,
            filtered: false,
          })),
        },
      },
    });

  return (
    <div className="my-2 search-filter-sort-wrapper">
      <div className="search-bar-wrapper mx-auto text-center px-0-75 py-0-5">
        <input
          type="section"
          className="input-search-note text-lg"
          placeholder="Enter search text"
          onChange={handleChangeSearchText}
          value={searchText}
        />
        {displayNotes.length > 0 && (
          <button
            className="btn btn-secondary btn-icon btn-filter"
            onClick={(e) => handleChangeShowFilterModal("OPEN_FILTER_MODAL")}
          >
            <span className="icon mui-icon">
              <FilterAltSharp />
            </span>
          </button>
        )}
      </div>
      {showFilterModal && (
        <FilterDrawerPortal
          handleChangeShowFilterModal={handleChangeShowFilterModal}
        />
      )}
      <div className="text-clear-button-wrapper flex-row flex-justify-between flex-align-start mx-auto mt-1">
        <div className="sort-filter-text flex-col flex-align-start">
          {sortByDate && (
            <p className="sort-options-text">Sort by- {sortByDate}</p>
          )}
          {sortByPriority && (
            <p className="sort-options-text">Sort by- {sortByPriority}</p>
          )}
          {filterByLabel.some((filter) => filter.filtered) && (
            <div className="filter-options-text flex-row flex-row flex-align-center flex-justify-start">
              Filter by Label-
              {filterByLabel.map(
                ({ id, label, filtered }, index) =>
                  filtered && <span key={id}>{label}</span>
              )}
            </div>
          )}
          {filterByPriority.some((filter) => filter.filtered) && (
            <div className="filter-options-text flex-row flex-row flex-align-center flex-justify-start">
              Filter by Priority-
              {filterByPriority.map(
                ({ id, priority, filtered }) =>
                  filtered && <span key={id}>{priority}</span>
              )}
            </div>
          )}
        </div>
        {sortByPriority ||
        sortByDate ||
        filterByLabel.some((filter) => filter.filtered) ||
        filterByPriority.some((filter) => filter.filtered) ? (
          <button
            className="btn btn-secondary text-sm px-0-5 py-0-25"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        ) : null}
      </div>
    </div>
  );
};

export { SearchBar };
