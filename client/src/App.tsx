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
import { WebsocketProvider } from 'y-websocket'
import Collaboration from '@tiptap/extension-collaboration'
// Removed CollaborationCursor to avoid runtime error when awareness is undefined
import { loadDocument, saveDocument } from './api.js';
import { WS_URL, URLS } from './config.js';

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

  return (
    <div style={{ 
      height: '100vh', 
      boxSizing: 'border-box', 
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <h1 style={{ 
        margin: '0 0 20px 0',
        fontSize: '4.5em',
        background: 'linear-gradient(135deg, #ffffff 0%, #ffd89b 50%, #ffffff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: '800',
        letterSpacing: '-3px',
        textAlign: 'center',
        textShadow: '0 8px 32px rgba(255, 255, 255, 0.5)',
        filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
        animation: 'titleGlow 3s ease-in-out infinite'
      }}>✨ Document Editor</h1>

      {/* Access URLs Display */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '24px',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        width: '100%',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.9em', color: '#fff', fontWeight: '600' }}>
          <div>
            <span style={{ opacity: 0.8 }}>💻 PC:</span> <code style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '8px', marginLeft: '8px' }}>{URLS.PC.frontend}</code>
          </div>
          <div>
            <span style={{ opacity: 0.8 }}>📱 Phone:</span> <code style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '8px', marginLeft: '8px' }}>{URLS.PHONE.frontend}</code>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
        backdropFilter: 'blur(30px)',
        borderRadius: '24px',
        padding: '20px 28px',
        marginBottom: '28px',
        boxShadow: '0 15px 45px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        width: '100%',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().toggleBold().run();}} title="Bold">𝐁</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().toggleItalic().run();}} title="Italic">𝐼</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().toggleUnderline().run();}} title="Underline">U̲</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().toggleHeading({ level: 2 }).run();}} title="Heading 2">H₂</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().setTextAlign('left').run();}} title="Align Left">≡</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().setTextAlign('center').run();}} title="Align Center">☰</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().setTextAlign('right').run();}} title="Align Right">≣</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().toggleBulletList().run();}} title="Bullet List">•</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().toggleOrderedList().run();}} title="Numbered List">1.</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().toggleBlockquote().run();}} title="Quote">❝</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().toggleCodeBlock().run();}} title="Code Block">⟨/⟩</button>
          <input type="color" disabled={!editor} onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()} title="Text color" />
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().undo().run();}} title="Undo">↶</button>
          <button type="button" disabled={!editor} onMouseDown={(e)=>{e.preventDefault(); editor?.chain().focus().redo().run();}} title="Redo">↷</button>
        </div>
      </div>

      
      
      {/* Editor Container */}
      <div style={{ flex: 1, overflow: 'hidden', width: '100%' }}>
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%)',
            backdropFilter: 'blur(30px)',
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3em',
            color: '#667eea',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            border: '2px solid rgba(255, 255, 255, 0.4)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '4em', 
                marginBottom: '20px',
                animation: 'bounce 2s ease-in-out infinite'
              }}>📝</div>
              <div style={{
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Loading editor...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
