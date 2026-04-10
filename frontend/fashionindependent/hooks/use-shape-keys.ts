import { useEffect } from "react";
import * as THREE from "three";
import { createGenderConfig } from "@/lib/body-groups";

/**
 * useShapeKeys
 * Binds controller (slider) values to morph target influences on a loaded GLTF model.
 * @param model The loaded THREE.Object3D (root of the model)
 * @param shapeKeyValues An object mapping shape key (morph target) names to values (0-1)
 */

// gender is hardcoded to 'female' for now; you can make it a prop if needed
export function useShapeKeys(
	model: THREE.Object3D | null,
	shapeKeyValues: Record<string, number>,
	gender: 'male' | 'female' = 'female'
) {
	useEffect(() => {
		if (!model) return;

		// Get the config for the gender
		const config = createGenderConfig(gender);

        // Enhanced shape key debugging with forced visibility
        console.log('🎯 [useShapeKeys] Processing shape keys:', {
            step: 'Initial values',
            gender,
            receivedValues: shapeKeyValues,
            modelPresent: !!model,
            availableGroups: Object.keys(config)
        });

        // Build a mapping from morph target name to value
		const morphTargetMap: Record<string, number> = {};
		Object.entries(config).forEach(([groupKey, group]) => {
			Object.entries(group.measurements).forEach(([sliderKey, shapeConfig]) => {
				const rawValue = shapeKeyValues[sliderKey];
				const value = typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue : 0;
				
				console.log('🔄 [useShapeKeys] Processing value:', {
					sliderKey,
					rawValue,
					normalizedValue: value
				});
				
				if (shapeConfig.type === "enum") {
					// Only set the selected index to 1, others to 0
					const idx = Math.round(value);
					shapeConfig.keys.forEach((morphKey, i) => {
						morphTargetMap[morphKey] = i === idx ? 1 : 0;
					});
				} else {
					shapeConfig.keys.forEach((morphKey) => {
						// Handle min/max constraints
						let finalValue = value;
						if (shapeConfig.min !== undefined) {
							finalValue = Math.max(finalValue, shapeConfig.min);
						}
						if (shapeConfig.max !== undefined) {
							finalValue = Math.min(finalValue, shapeConfig.max);
						}
						morphTargetMap[morphKey] = finalValue;
					});
				}
			});
		});

		// Traverse all meshes in the model and set morph target influences
		model.traverse((obj) => {
			if ((obj as THREE.Mesh).isMesh) {
				const mesh = obj as THREE.Mesh;
				const morphDict = mesh.morphTargetDictionary;
				const influences = mesh.morphTargetInfluences;
				if (morphDict && influences) {
					console.log('🔍 [useShapeKeys] Found mesh with morph targets:', {
						step: 'Processing mesh',
						meshName: obj.name,
						availableMorphTargets: Object.keys(morphDict),
						currentInfluences: [...influences],
						mappingToApply: morphTargetMap
					});

					// Reset all influences to 0 first
					for (let i = 0; i < influences.length; i++) {
						influences[i] = 0;
					}

					// Apply the new values
					Object.entries(morphDict).forEach(([key, idx]) => {
						if (typeof idx === "number" && key in morphTargetMap) {
							const oldValue = influences[idx];
							influences[idx] = morphTargetMap[key];
							
							console.log('✨ [useShapeKeys] Updated morph target:', {
								step: 'Value update',
								targetName: key,
								oldValue,
								newValue: morphTargetMap[key],
								meshName: obj.name
							});
						}
					});
					
					// Mark the mesh as needing update
					if (mesh.geometry) {
						mesh.geometry.attributes.position?.needsUpdate && (mesh.geometry.attributes.position.needsUpdate = true);
					}
				}
			}
		});
	}, [model, shapeKeyValues, gender]);
}