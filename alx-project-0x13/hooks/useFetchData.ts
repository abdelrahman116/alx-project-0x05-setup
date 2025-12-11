// import { ImageProps } from "@/interfaces";
// import { useState } from "react";

// const useFetchData = <T, R>() => {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [responseData, setResponseData] = useState<T | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);

//   const fetchData = async (endpoint: string, body: R) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const resp = await fetch(endpoint, {
//         method: "POST",
//         body: JSON.stringify(body),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!resp.ok) {
//         throw new Error("Failed to fetch data");
//       }

//       const result = await resp.json();
//       setResponseData(result);
//       setGeneratedImages((prev) => [
//         ...prev,
//         { imageUrl: result?.message, prompt: body?.prompt },
//       ]);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     isLoading,
//     responseData,
//     error,
//     fetchData,
//     generatedImages,
//   };
// };

// export default useFetchData;

import { ImageProps } from "@/interfaces";
import { useState } from "react";

export interface ApiResponse {
  message?: string;
  prompt?: string;
}

const useFetchData = <
  T extends ApiResponse = ApiResponse,
  R extends { prompt?: string } = { prompt?: string }
>() => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);

  const fetchData = async (endpoint: string, body: R) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = (await resp.json()) as T;
      setResponseData(result);

      // Guard: only push if both values are real strings
      const imageUrl = result?.message;
      const prompt = (body as any)?.prompt;

      if (
        typeof imageUrl === "string" &&
        imageUrl.length > 0 &&
        typeof prompt === "string" &&
        prompt.length > 0
      ) {
        setGeneratedImages((prev) => [...prev, { imageUrl, prompt }]);
      } else {
        // optional: decide how to handle missing values
        console.warn(
          "Skipping generatedImages update — missing imageUrl or prompt",
          { imageUrl, prompt }
        );
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    responseData,
    error,
    fetchData,
    generatedImages,
  };
};

export default useFetchData;
