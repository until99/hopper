interface SessionExpiredNotificationProps {
  onClose: () => void;
}

export function SessionExpiredNotification({ onClose }: SessionExpiredNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <svg 
              className="w-5 h-5 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sessão Expirada
          </h3>
        </div>
        
        <p className="text-gray-700 mb-6">
          Sua sessão expirou por motivos de segurança. Por favor, faça login novamente para continuar.
        </p>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    </div>
  );
}
