import { useContext } from "react";
import { ContentContext } from "./context";

export default function useContent() {
  return useContext(ContentContext);
}
