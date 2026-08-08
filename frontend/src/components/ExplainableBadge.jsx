import React from 'react';
import { Chip, Tooltip, Box } from '@mui/material';
import { Sparkles, Info } from 'lucide-react';

const ExplainableBadge = ({ explanation, matchScore }) => {
  if (!explanation && !matchScore) return null;

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', my: 1 }}>
      {matchScore && (
        <Tooltip title="Neural Two-Tower Intent Match Score">
          <Chip
            icon={<Sparkles size={14} color="#14b8a6" />}
            label={`${Math.round(matchScore * 100)}% AI Match`}
            size="small"
            sx={{
              backgroundColor: 'rgba(13, 148, 136, 0.15)',
              color: '#2dd4bf',
              fontWeight: 700,
              fontSize: '0.72rem',
              border: '1px solid rgba(20, 184, 166, 0.3)',
            }}
          />
        </Tooltip>
      )}
      {explanation && (
        <Tooltip title={explanation}>
          <Chip
            icon={<Info size={12} color="#38bdf8" />}
            label={explanation.length > 32 ? explanation.substring(0, 32) + '...' : explanation}
            size="small"
            sx={{
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              fontWeight: 500,
              fontSize: '0.70rem',
              border: '1px solid rgba(56, 189, 248, 0.25)',
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default ExplainableBadge;
