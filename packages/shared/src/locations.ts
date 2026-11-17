export const POPULAR_PG_CITIES = [
  'Noida', 'Gurgaon', 'Delhi', 'Ghaziabad', 'Bangalore', 'Pune',
  'Hyderabad', 'Mumbai', 'Chennai', 'Lucknow', 'Ahmedabad', 'Chandigarh',
] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

export const CITY_STATE_HINT: Record<string, string> = {
  Noida: 'Uttar Pradesh',
  Gurgaon: 'Haryana',
  Delhi: 'Delhi',
  Ghaziabad: 'Uttar Pradesh',
  Bangalore: 'Karnataka',
  Pune: 'Maharashtra',
  Hyderabad: 'Telangana',
  Mumbai: 'Maharashtra',
  Chennai: 'Tamil Nadu',
  Lucknow: 'Uttar Pradesh',
  Ahmedabad: 'Gujarat',
  Chandigarh: 'Chandigarh',
};

export function formatBuildingLocation(building: {
  city: string;
  state?: string | null;
  address?: string | null;
}) {
  const line = [building.city, building.state].filter(Boolean).join(', ');
  return building.address?.trim() ? `${building.address.trim()} · ${line}` : line;
}
