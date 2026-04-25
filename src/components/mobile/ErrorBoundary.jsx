import { Component } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-s5">
          <Card thick variant="danger" padding="s6" className="max-w-md">
            <div className="flex flex-col items-center text-center space-y-s4">
              <AlertCircle size={48} className="text-neg" />
              <div>
                <h2 className="text-h2 font-bold text-neg mb-s2">
                  Algo deu errado
                </h2>
                <p className="text-body text-ink-3 mb-s4">
                  {this.state.error?.message || 'Erro desconhecido'}
                </p>
              </div>
              <Button
                kind="primary"
                full
                onClick={this.handleReset}
              >
                Tentar novamente
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
