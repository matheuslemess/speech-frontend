import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import { FaBold, FaItalic, FaStrikethrough, FaListOl, FaListUl, FaQuoteLeft, FaUndo, FaRedo } from 'react-icons/fa';

// A barra de ferramentas será um componente separado para manter a clareza
const TiptapToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <HStack spacing={1} wrap="wrap" p={2} borderWidth={1} borderRadius="md">
      <IconButton icon={<FaBold />} aria-label="Negrito" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
      <IconButton icon={<FaItalic />} aria-label="Itálico" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
      <IconButton icon={<FaStrikethrough />} aria-label="Riscado" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} />
      <IconButton icon={<FaQuoteLeft />} aria-label="Citação" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} />
      <IconButton icon={<FaListOl />} aria-label="Lista Ordenada" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />
      <IconButton icon={<FaListUl />} aria-label="Lista" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
      <IconButton icon={<FaUndo />} aria-label="Desfazer" onClick={() => editor.chain().focus().undo().run()} />
      <IconButton icon={<FaRedo />} aria-label="Refazer" onClick={() => editor.chain().focus().redo().run()} />
    </HStack>
  );
};

// O componente principal do editor
const TiptapEditor = ({ content, onContentChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Desabilitar heading se não precisar, para simplificar a barra de ferramentas
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    // Estilos do editor aplicados diretamente via props
    editorProps: {
      attributes: {
        class: 'prosemirror-editor', // Usaremos essa classe para estilização
      },
    },
  });

  return (
    <Box borderWidth={1} borderRadius="md" >
      <TiptapToolbar editor={editor} />
      <Box p={2} minH="200px">
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default TiptapEditor;