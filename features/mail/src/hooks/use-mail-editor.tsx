import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

const extensions = [
  StarterKit.configure({
    heading: false,
  }),
  Underline,
];

export function useMailEditor({ defaultContent = '' }) {
  return useEditor({
    extensions,
    content: defaultContent,
  });
}
