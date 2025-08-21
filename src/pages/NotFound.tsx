// src/pages/NotFound.tsx
import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add this import

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Add this line

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('notFound.subTitle')} // Use translation
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('notFound.backHome')} {/* Use translation */}
        </Button>
      }
    />
  );
};