import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

interface ExtensionOptions {
  placeholder?: string;
}

const getExtensions = ({ placeholder }: ExtensionOptions) => [
  StarterKit.configure({
    heading: false,
  }),
  Underline,
  Placeholder.configure({
    placeholder,
  }),
];

export function useMailEditor({ defaultContent = '', placeholder = '' }) {
  return useEditor({
    extensions: getExtensions({
      placeholder,
    }),
    content: defaultContent,
  });
}
