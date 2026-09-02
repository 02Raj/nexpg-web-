export type BedStatus = 'empty' | 'occupied';
export type TenantStatus = 'active' | 'vacated';
export type SecurityStatus = 'held' | 'refund_due' | 'refunded';
export type InvoiceStatus = 'pending' | 'paid';
export type PaymentMode = 'upi' | 'cash';

export type Building = {
  id: string;
  owner_id: string;
  name: string;
  city: string;
  billing_date: number;
  created_at: string;
  updated_at: string;
};

export type Room = {
  id: string;
  owner_id: string;
  building_id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type Bed = {
  id: string;
  owner_id: string;
  building_id: string;
  room_id: string;
  label: string;
  status: BedStatus;
  created_at: string;
  updated_at: string;
};

export type Tenant = {
  id: string;
  owner_id: string;
  building_id: string;
  bed_id: string;
  full_name: string;
  phone: string;
  monthly_rent: number;
  join_date: string;
  status: TenantStatus;
  vacated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SecurityDeposit = {
  id: string;
  owner_id: string;
  building_id: string;
  tenant_id: string;
  amount: number;
  status: SecurityStatus;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MonthlyInvoice = {
  id: string;
  owner_id: string;
  building_id: string;
  tenant_id: string;
  billing_period: string;
  amount: number;
  is_prorated: boolean;
  status: InvoiceStatus;
  payment_mode: PaymentMode | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApkDownloadRequest = {
  id: string;
  owner_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: 'pending' | 'ready' | 'downloaded';
  download_url: string | null;
  requested_at: string;
  download_ready_at: string | null;
  downloaded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OccupancyCell = Bed & {
  room_name: string;
  tenant?: Pick<Tenant, 'id' | 'full_name' | 'monthly_rent'> | null;
};

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      pg_buildings: Table<Building>;
      pg_rooms: Table<Room>;
      pg_beds: Table<Bed>;
      tenants: Table<Tenant>;
      security_deposits: Table<SecurityDeposit>;
      monthly_invoices: Table<MonthlyInvoice>;
      apk_download_requests: Table<ApkDownloadRequest>;
    };
    Views: Record<string, never>;
    Functions: {
      rpc_add_room_with_beds: {
        Args: { p_building_id: string; p_name: string; p_bed_count: number };
        Returns: string;
      };
      rpc_add_tenant: {
        Args: {
          p_bed_id: string;
          p_full_name: string;
          p_phone: string;
          p_monthly_rent: number;
          p_security_amount: number;
          p_join_date: string;
        };
        Returns: string;
      };
      rpc_vacate_tenant: { Args: { p_tenant_id: string }; Returns: undefined };
      rpc_mark_invoice_paid: {
        Args: { p_invoice_id: string; p_payment_mode: PaymentMode };
        Returns: undefined;
      };
      rpc_mark_security_refunded: { Args: { p_deposit_id: string }; Returns: undefined };
      rpc_generate_invoices: { Args: { p_building_id: string }; Returns: number };
      rpc_maybe_generate_invoices: { Args: { p_building_id: string }; Returns: number };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
