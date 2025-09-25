
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

export interface BatteryState {
  soc: number;
  status: string;
}

export interface MultiBatteryData {
  timestamp: number;
  battery1: BatteryState; // Underflow scenario
  battery2: BatteryState; // Overflow scenario
  battery3: BatteryState; // Fault scenario
  faultDetected: boolean;
  onMainPower: boolean;
  isDumpingSolar: boolean;
  activeBattery: number;
}
