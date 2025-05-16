import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Modal } from '@/components/ui/Modal';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface CreditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  currentCredits: number;
  onSave: (userId: string, amount: number, reason: string) => Promise<void>;
  isProcessing: boolean;
}

export function CreditDialog({
  isOpen,
  onClose,
  userId,
  userName,
  currentCredits,
  onSave,
  isProcessing,
}: CreditDialogProps) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setReason('');
      setOperation('add');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!amount) {
      setError('Por favor ingrese un monto');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('El monto debe ser un número mayor a cero');
      return;
    }

    if (operation === 'subtract' && amountNum > currentCredits) {
      setError('No hay suficientes créditos para restar');
      return;
    }

    if (!reason.trim()) {
      setError('Por favor ingrese un motivo');
      return;
    }

    const finalAmount = operation === 'add' ? amountNum : -amountNum;
    
    try {
      await onSave(userId, finalAmount, reason);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al actualizar los créditos');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números y un punto decimal opcional
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      if (error) setError('');
    }
  };

  const calculateNewBalance = () => {
    if (!amount) return currentCredits;
    const amountNum = parseFloat(amount) || 0;
    return operation === 'add' 
      ? currentCredits + amountNum 
      : Math.max(0, currentCredits - amountNum);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${operation === 'add' ? 'Agregar' : 'Quitar'} Créditos`}
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Guardar'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">
              Usuario: <span className="font-medium text-gray-900">{userName}</span>
            </p>
            <p className="text-sm text-gray-500">
              Créditos actuales: <span className="font-medium text-gray-900">{currentCredits.toLocaleString()}</span>
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="operation" className="block text-sm font-medium text-gray-700">
                Operación
              </label>
              <select
                id="operation"
                name="operation"
                value={operation}
                onChange={(e) => setOperation(e.target.value as 'add' | 'subtract')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="add">Agregar créditos</option>
                <option value="subtract">Quitar créditos</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Cantidad <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                  aria-describedby="amount-currency"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="amount-currency">
                    créditos
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Motivo <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                rows={3}
                name="reason"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Ej. Compra de paquete Premium, Ajuste manual, etc."
              />
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Nuevo saldo:</span>{' '}
                  <span className="font-bold">{calculateNewBalance().toLocaleString()}</span> créditos
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
