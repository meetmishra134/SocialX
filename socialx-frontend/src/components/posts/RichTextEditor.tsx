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

  // 1. INITIALIZATION EFFECT (Runs once on mount)
  useEffect(() => {
    const Link = Quill.import("formats/link") as unknown as {
      sanitize?: (url: string) => string;
    };
    Link.sanitize = (url: string) => {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`;
      }
      return url;
    };
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Write your content here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
          ],
        },
      });

      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }

      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root.innerHTML || "";

        if (html === "<p><br></p>" || html === "") {
          onChange("");
        } else {
          onChange(html);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // 2. THE SYNC EFFECT (Runs when React Hook Form changes the value)
  useEffect(() => {
    // If RHF resets the value to an empty string (e.g., after a successful post)
    if (quillRef.current && value === "") {
      const currentHtml = quillRef.current.root.innerHTML;

      // Only clear Quill if it isn't ALREADY empty to prevent an infinite loop
      if (currentHtml !== "<p><br></p>" && currentHtml !== "") {
        quillRef.current.setText(""); // This physically clears the editor UI
      }
    }
  }, [value]);

  return (
    <div className="flex w-full flex-col">
      <div className="[&_.ql-toolbar]:border-input [&_.ql-toolbar]:bg-muted/50 [&_.ql-container]:border-input [&_.ql-editor.ql-blank::before]:text-muted-foreground! [&_.ql-container]:rounded-b-md [&_.ql-container]:text-base [&_.ql-editor]:max-h-[40vh] [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:overflow-y-auto [&_.ql-editor_img]:my-4 [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:rounded-md [&_.ql-editor.ql-blank::before]:not-italic! [&_.ql-toolbar]:rounded-t-md">
        <div ref={editorRef} />
      </div>
    </div>
  );
};

export default RichTextEditor;
