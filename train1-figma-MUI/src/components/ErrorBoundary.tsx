import { Component, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { PALETTE } from '../theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch() {
    // Co the gui loi den tracking service o day
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            p: 4,
            border: `1px solid ${PALETTE.TEXT_HINT}`,
            borderRadius: 2,
            backgroundColor: PALETTE.BACKGROUND_PAPER,
            textAlign: 'center',
            my: 2,
          }}
        >
          <Typography variant="h6" color="error" gutterBottom sx={{ fontWeight: 600 }}>
            Đã có lỗi xảy ra ở phần tính năng này.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {this.state.error?.message || 'Lỗi không xác định'}
          </Typography>
          <Button variant="outlined" color="primary" onClick={this.handleReset}>
            Thử lại
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
