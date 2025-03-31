import { ReactNode, useEffect, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  rootMargin?: string;
  height?: string | number;
  sx?: React.CSSProperties;
  endMessage?: ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  onLoadMore,
  hasMore,
  isLoading = false,
  rootMargin = "100px",
  height = "100%",
  sx = {},
  endMessage = "No more items to load",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingTriggerRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const loadingTrigger = loadingTriggerRef.current;
    if (!container || !loadingTrigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && hasMore && !isLoading && !isFetching) {
          setIsFetching(true);
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0.1,
      }
    );

    observer.observe(loadingTrigger);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, isFetching, onLoadMore, rootMargin]);

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height,
        overflowY: "auto",
        scrollBehavior: "smooth",
        ...sx,
      }}
    >
      {children}

      <Box
        ref={loadingTriggerRef}
        sx={{
          width: "100%",
          height: "10px",
          visibility: hasMore ? "visible" : "hidden",
        }}
      />

      {hasMore && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
          }}
        >
          {isLoading && <CircularProgress size={24} />}
        </Box>
      )}

      {!hasMore && endMessage && (
        <Box
          sx={{
            textAlign: "center",
            color: "text.secondary",
            py: 2,
          }}
        >
          {endMessage}
        </Box>
      )}
    </Box>
  );
};

export default InfiniteScroll;
