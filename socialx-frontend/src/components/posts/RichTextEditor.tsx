import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  useEffect(() => {
    // Only initialize if the DOM is ready AND Quill hasn't been initialized yet
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Write your content here...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
      });

      // Set initial value
      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }

      // Listen for user typing
      quillRef.current.on("text-change", () => {
        // Extract the raw HTML content
        const html = quillRef.current?.root.innerHTML || "";

        // THE FIX: If Quill is empty, send a true empty string to React
        if (html === "<p><br></p>" || html === "") {
          onChange("");
        } else {
          onChange(html);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    /* TAILWIND STYLING WRAPPER 
      We use Tailwind here to style the container holding Quill. 
      The '[&_.ql-container]' syntax targets Quill's injected classes 
      to override their default borders and match your app's theme.
    */
    <div className="flex w-full flex-col">
      <div className="/* Toolbar styling */ [&_.ql-toolbar]:border-input [&_.ql-toolbar]:bg-muted/50 /* Container styling */ [&_.ql-container]:border-input /* Control the height and make it scrollable */ /* Image styling */ /* THE FIX: Added '!' to force the color and font-style to override Quill */ [&_.ql-editor.ql-blank::before]:text-muted-foreground! [&_.ql-container]:rounded-b-md [&_.ql-container]:text-base [&_.ql-editor]:max-h-[40vh] [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor_img]:my-4 [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:rounded-md [&_.ql-editor.ql-blank::before]:not-italic! [&_.ql-toolbar]:rounded-t-md">
        <div ref={editorRef} />
      </div>
    </div>
  );
};

export default RichTextEditor;
