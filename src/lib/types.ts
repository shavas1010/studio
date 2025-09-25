export interface MicrogridData {
  timestamp: number;
  output_current: number;
  output_voltage: number;
  input_current: number;
  input_voltage: number;
  battery_soc: number;
  charging_source: 'renewable' | 'grid';
  battery_charge: number;
  efficiency: number;
}
