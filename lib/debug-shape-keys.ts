// Shape Keys Debug Logger

interface ShapeKeyUpdate {
  key: string;
  oldValue: number;
  newValue: number;
  reason: string;
}

export function logShapeKeyChanges(
  prevValues: Record<string, number>,
  newValues: Record<string, number>,
  reason: string
) {
  console.group('🔄 Shape Keys Update');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Update Reason:', reason);

  const changes: ShapeKeyUpdate[] = [];
  
  // Compare old and new values
  Object.entries(newValues).forEach(([key, value]) => {
    const oldValue = prevValues[key];
    if (oldValue !== value) {
      changes.push({
        key,
        oldValue,
        newValue: value,
        reason
      });
    }
  });

  if (changes.length === 0) {
    console.log('No shape key changes detected');
  } else {
    console.table(changes.map(change => ({
      'Shape Key': change.key,
      'Old Value': change.oldValue.toFixed(3),
      'New Value': change.newValue.toFixed(3),
      'Change': (change.newValue - change.oldValue).toFixed(3),
      'Reason': change.reason
    })));
  }

  console.groupEnd();
}

export function logShapeKeyState(values: Record<string, number>, context: string = '') {
  console.group(`📊 Current Shape Keys State ${context ? `(${context})` : ''}`);
  
  const formattedValues = Object.entries(values).map(([key, value]) => ({
    'Shape Key': key,
    'Value': value.toFixed(3)
  }));

  console.table(formattedValues);
  console.groupEnd();
}

// Function to monitor shape key reconciliation
export function monitorReconciliation(
  beforeValues: Record<string, number>,
  afterValues: Record<string, number>,
  ruleName: string,
  targetMeasurement: string,
  targetValue: number
) {
  console.group(`⚖️ Reconciliation for ${ruleName}`);
  console.log(`Triggered by ${targetMeasurement} = ${targetValue}`);

  const changes = Object.entries(afterValues).filter(([key, value]) => {
    return value !== beforeValues[key];
  });

  if (changes.length > 0) {
    console.log('Changes applied:');
    console.table(changes.map(([key, newValue]) => ({
      'Shape Key': key,
      'Before': beforeValues[key].toFixed(3),
      'After': newValue.toFixed(3),
      'Delta': (newValue - beforeValues[key]).toFixed(3)
    })));
  } else {
    console.log('No changes were needed');
  }

  console.groupEnd();
}