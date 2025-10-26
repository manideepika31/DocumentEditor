import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import * as Y from 'yjs'
import { undo as yUndo, redo as yRedo } from 'y-prosemirror'
import { WebsocketProvider } from 'y-websocket'
import Collaboration from '@tiptap/extension-collaboration'
// Removed CollaborationCursor to avoid runtime error when awareness is undefined
import { loadDocument, saveDocument } from './api.js';
import { WS_URL } from './config.js';

function App() {
  const [roomId] = useState('doc-1')
  const ydoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() => {
    if (!WS_URL) {
      // Static hosting (e.g., GitHub Pages): run without realtime server
      return null
    }
    try {
      console.log('Connecting to WebSocket:', WS_URL)
      return new WebsocketProvider(WS_URL, roomId, ydoc)
    } catch (e) {
      console.error(e)
      return null
    }
  }, [roomId, ydoc])

  const editor = useEditor(
    provider
      ? {
          extensions: [
            StarterKit.configure({ history: false }),
            Underline,
            Link.configure({ openOnClick: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            BulletList,
            OrderedList,
            ListItem,
            Blockquote,
            CodeBlock,
            Collaboration.configure({ document: ydoc }) as any
          ],
          editorProps: { attributes: { class: 'editor' } }
        }
      : {
          extensions: [StarterKit, Underline, Link, TextAlign, TextStyle, Color, BulletList, OrderedList, ListItem, Blockquote, CodeBlock],
          editorProps: { attributes: { class: 'editor' } }
        },
    [provider]
  )

  useEffect(() => {
    loadDocument(roomId)
      .then((doc: any) => {
        if (editor && doc && doc.content) {
          const isEmpty = JSON.stringify(editor.getJSON()) === JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] })
          if (isEmpty) editor.commands.setContent(doc.content, false)
        }
      })
      .catch((err: Error) => {
        console.warn('Database not available, using in-memory storage:', err)
      })
    const interval = setInterval(() => {
      const json = editor?.getJSON()
      if (json) {
        saveDocument(roomId, json)
          .then(() => {})
          .catch(() => {})
      }
    }, 3000)
    return () => {
      clearInterval(interval)
      provider?.destroy()
    }
  }, [editor, provider, roomId])

  const btn: React.CSSProperties = {
    background: '#222',
    color: '#fff',
    border: '1px solid #333',
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer'
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px', color: '#fff' }}>
      <h2 style={{ margin: 0, marginBottom: '16px', color: '#fff', fontWeight: 700 }}>DocumentEditor</h2>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().toggleUnderline().run()}>Underline</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>Left</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>Center</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>Right</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbers</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>Code</button>
        <button style={btn} disabled={!editor} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</button>
        <button style={btn} disabled={!editor} onClick={() => { if (!editor) return; if (provider) { yUndo(editor.view.state); editor.view.focus(); } else { editor.chain().focus().undo().run(); } }}>Undo</button>
        <button style={btn} disabled={!editor} onClick={() => { if (!editor) return; if (provider) { yRedo(editor.view.state); editor.view.focus(); } else { editor.chain().focus().redo().run(); } }}>Redo</button>
      </div>
      <div style={{ background: '#fff', color: '#000', minHeight: '75vh', borderRadius: '4px', padding: '24px', maxWidth: '1100px' }}>
        {editor ? (<EditorContent editor={editor} />) : null}
      </div>
    </div>
  )
}

export default App
