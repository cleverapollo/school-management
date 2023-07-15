import { useEffect, useRef, useState } from 'react';

const ROWS_PER_PAGE = 10;
const INITIAL_PAGE = 1;

type UsePaginationListArgs<T> = {
  filteredList: T;
  initialList: T;
  rowsPerPage?: number;
  initialPage?: number;
};

export const usePaginationList = <T extends Array<any>>({
  filteredList,
  initialList,
  initialPage = INITIAL_PAGE,
  rowsPerPage = ROWS_PER_PAGE,
}: UsePaginationListArgs<T>) => {
  const currentListLengthRef = useRef<number>(0);

  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationCount = Math.ceil(filteredList.length / rowsPerPage);

  useEffect(() => {
    if (paginationCount > 0 && currentPage > paginationCount) {
      setCurrentPage(paginationCount);
    }
  }, [filteredList]);

  useEffect(() => {
    // move to initial page when a new item is added
    if (initialList.length > currentListLengthRef.current) {
      setCurrentPage(initialPage);
      currentListLengthRef.current = initialList.length;
    }
  }, [initialList]);

  return {
    currentList: filteredList.slice(
      (currentPage - 1) * rowsPerPage,
      (currentPage - 1) * rowsPerPage + rowsPerPage
    ) as T,
    setCurrentPage,
    currentPage,
    paginationCount,
  };
};
