export const NotFoundPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 88px)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 className="text text_type_main-large mb-4">404</h1>
        <p className="text text_type_main-medium text_color_inactive">
          Страница не найдена
        </p>
      </div>
    </div>
  );
};
