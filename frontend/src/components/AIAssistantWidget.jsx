import React, { useState } from 'react';
import {
  Fab,
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  List,
  ListItem,
} from '@mui/material';
import { Bot, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { searchAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AIAssistantWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Findora AI, your personal shopping assistant. Ask me anything like "I need black running shoes under ₹3000" or "What goes well with leather backpacks?"',
      suggestions: ['Black running shoes under ₹3000', 'Best activewear for gym', 'Top gifts for travelers'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (queryText = null) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await searchAPI.assistantChat(textToSend);
      const { reply, intent_summary, suggested_products, suggested_queries } = res.data;

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          intent: intent_summary,
          products: suggested_products,
          suggestions: suggested_queries,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Apologies, I encountered an issue reaching the vector intelligence engine.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        className="glow-btn"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200,
          backgroundColor: '#0d9488',
          '&:hover': { backgroundColor: '#0f766e' },
          width: 60,
          height: 60,
        }}
      >
        <Bot size={28} color="#ffffff" />
      </Fab>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 420 },
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: '#0b131e',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: '#0d9488', width: 36, height: 36 }}>
              <Sparkles size={20} color="#fff" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Findora AI Assistant
              </Typography>

              <Typography variant="caption" sx={{ color: '#2dd4bf', fontWeight: 600 }}>
                RAG + Intent Intelligence
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Message Container */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1.8,
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: msg.sender === 'user' ? '#0d9488' : 'rgba(30, 41, 59, 0.8)',
                  color: '#f8fafc',
                  border: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.9rem' }}>
                  {msg.text}
                </Typography>

                {msg.intent && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#38bdf8', fontWeight: 600 }}>
                    ⚡ {msg.intent}
                  </Typography>
                )}
              </Paper>

              {/* Product recommendations inside chat */}
              {msg.products && msg.products.length > 0 && (
                <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {msg.products.map((prod) => (
                    <Paper
                      key={prod.id}
                      onClick={() => {
                        setOpen(false);
                        navigate(`/products/${prod.id}`);
                      }}
                      sx={{
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        cursor: 'pointer',
                        backgroundColor: '#1e293b',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#334155' },
                      }}
                    >
                      <img src={prod.image_url} alt={prod.title} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#f8fafc', display: 'block', noWrap: true }}>
                          {prod.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#2dd4bf', fontWeight: 800 }}>
                          ₹{prod.price.toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Suggested Follow-up Chip Queries */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1.5 }}>
                  {msg.suggestions.map((sug, i) => (
                    <Chip
                      key={i}
                      label={sug}
                      size="small"
                      onClick={() => handleSend(sug)}
                      sx={{
                        backgroundColor: 'rgba(13, 148, 136, 0.15)',
                        color: '#2dd4bf',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        '&:hover': { backgroundColor: 'rgba(13, 148, 136, 0.3)' },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: 'flex-start' }}>
              <CircularProgress size={18} sx={{ color: '#0d9488' }} />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Searching catalog vector space...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Input Box */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0b131e' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask Findora AI assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              sx={{
                backgroundColor: '#1e293b',
                borderRadius: 2,
                '& .MuiInputBase-input': { color: '#fff', fontSize: '0.88rem' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleSend()}
              disabled={loading}
              sx={{ minWidth: 46, px: 0, backgroundColor: '#0d9488', '&:hover': { backgroundColor: '#0f766e' } }}
            >
              <Send size={18} />
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AIAssistantWidget;
