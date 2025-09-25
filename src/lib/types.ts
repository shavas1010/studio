
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

export interface MultiBatteryData {
  timestamp: number;
  battery1: { soc: number; status: string };
  battery2: { soc: number; status: string };
  battery3: { soc: number; status: string };
  faultDetected: boolean;
  onMainPower: boolean;
  isDumpingSolar: boolean;
  activeBattery: number;
}
