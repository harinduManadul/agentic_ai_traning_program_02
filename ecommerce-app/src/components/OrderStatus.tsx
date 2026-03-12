type Status = 'Processing' | 'Shipped' | 'Delivered';

interface OrderStatusProps {
  status: Status;
}

const statusConfig: Record<Status, { className: string }> = {
  Processing: { className: 'status-processing' },
  Shipped: { className: 'status-shipped' },
  Delivered: { className: 'status-delivered' },
};

export default function OrderStatus({ status }: OrderStatusProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`order-status-badge ${config.className}`}
      data-testid="order-status-badge"
      role="status"
    >
      {status}
    </span>
  );
}
