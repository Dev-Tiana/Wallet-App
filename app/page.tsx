'use client';

import { useState } from 'react';
import { Container, Typography, Grid, Paper, Box, IconButton, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShareIcon from '@mui/icons-material/Share';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useWallet } from '@/context/WalletContext';

export default function Home() {
  const { balance } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [points, setPoints] = useState(120);
  const router = useRouter();

  const actions = [
    { label: 'Add Fund', route: '/FundWalletDialog', color: '#4caf50', icon: <AttachMoneyIcon fontSize="large" /> },
    { label: 'Send Money', route: '/SendMoneyDialog', color: '#f44336', icon: <SendIcon fontSize="large" /> },
    { label: 'Transactions', route: '/transactions', color: '#1976d2', icon: <HistoryIcon fontSize="large" /> },
    { label: 'App Settings', route: '/settings', color: '#ff9800', icon: <SettingsIcon fontSize="large" /> },
  ];

  return (
    <>
      {/* Overview Section */}
      <Box
        sx={{
          width: '100%',
          p: 4,
          background: 'linear-gradient(135deg, #2196f3 0%, #90caf9 100%)',
          color: '#fff',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <IconButton sx={{ color: '#fff' }}>
            <RefreshIcon />
          </IconButton>
          <Box>
            <IconButton sx={{ color: '#fff' }}>
              <NotificationsNoneIcon />
            </IconButton>
            <IconButton sx={{ color: '#fff' }}>
              <ShareIcon />
            </IconButton>
            <IconButton sx={{ color: '#fff' }}>
              <ViewAgendaIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h5" fontWeight="bold">
          Overview
        </Typography>
        <Typography variant="subtitle1" mb={3}>
          Digital Banking
        </Typography>
      </Box>

      {/* Wallet Container */}
      <Container sx={{ mt: 8, position: 'relative' }}>
        <Paper
          elevation={8}
          sx={{
            p: 8,
            borderRadius: 4,
            backgroundColor: '#1976d2',
            color: '#fff',
            position: 'relative',
          }}
        >
          {/* Points */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, textAlign: 'right' }}>
            <Typography variant="subtitle2">Points Available</Typography>
            <Typography variant="h6" fontWeight="bold">{points}</Typography>
          </Box>

          {/* Balance & Eye */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Total Balance</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" fontWeight="bold">
                {showBalance ? `$${balance.toFixed(2)}` : '******'}
              </Typography>
              <IconButton sx={{ ml: 2, color: '#fff' }} onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2">Account: ******3445677</Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ffeb3b',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#fdd835' },
                  mt: { xs: 2, sm: 0 },
                }}
                onClick={() => router.push('/buy-points')}
              >
                Buy Points
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Quick Actions */}
        <Typography variant="h5" fontWeight="bold" mb={2} mt={6} color="text.primary">
          Quick Actions
        </Typography>

        {/* Big Quick Actions Grid */}
<Box
  mb={6}
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: { xs: 2, md: 4 },
  }}
>
  {actions.map((action) => (
    <Box
      key={action.label}
      sx={{
        // ✅ 2 columns on mobile, auto on desktop
        width: { xs: '45%', md: 'auto' },
        flexGrow: { md: 1 },
      }}
    >
      <Paper
        onClick={() => router.push(action.route)}
        elevation={4}
        sx={{
          p: { xs: 2, md: 4 },
          textAlign: 'center',
          borderRadius: 3,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: action.color,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 120,
          '&:hover': {
            transform: 'translateY(-5px) scale(1.03)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
          },
        }}
      >
        <Box sx={{ mb: 1 }}>{action.icon}</Box>
        <Typography variant="h6" fontWeight="bold">
          {action.label}
        </Typography>
      </Paper>
    </Box>
  ))}
</Box>



        {/* Row Quick Actions */}
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            m: { xs: 0, md: 6 },
            mb: 5,
            borderRadius: 3,
            backgroundColor: '#fff',
            mx: { xs: 0, md: 3 },
          }}
          elevation={3}
        >
          <Grid container spacing={{ xs: 1, md: 8 }}>
            {actions.map((action) => (
              <Grid item xs={4} key={action.label}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    m: { xs: 1, md: 5 },
                    borderColor: '#ccc',
                    color: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 1,
                    '&:hover': {
                      color: action.color,
                      borderColor: action.color,
                      transform: 'translateY(-3px)',
                    },
                  }}
                  onClick={() => router.push(action.route)}
                >
                  {action.icon}
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{action.label}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
