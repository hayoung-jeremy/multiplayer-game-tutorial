import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";
import { useGraph, GroupProps } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Casual_Feet_1: THREE.SkinnedMesh;
    Casual_Feet_2: THREE.SkinnedMesh;
    Casual_Legs_1: THREE.SkinnedMesh;
    Casual_Legs_2: THREE.SkinnedMesh;
    Casual_Head_1: THREE.SkinnedMesh;
    Casual_Head_2: THREE.SkinnedMesh;
    Casual_Head_3: THREE.SkinnedMesh;
    Casual_Head_4: THREE.SkinnedMesh;
    Casual_Body_1: THREE.SkinnedMesh;
    Casual_Body_2: THREE.SkinnedMesh;
    Root: THREE.Bone;
  };
  materials: {
    White: THREE.MeshStandardMaterial;
    Purple: THREE.MeshStandardMaterial;
    Skin: THREE.MeshStandardMaterial;
    LightBlue: THREE.MeshStandardMaterial;
    Eyebrows: THREE.MeshStandardMaterial;
    Eye: THREE.MeshStandardMaterial;
    Hair: THREE.MeshStandardMaterial;
  };
  animations: THREE.AnimationClip[];
};

type ActionName =
  | "CharacterArmature|Death"
  | "CharacterArmature|Gun_Shoot"
  | "CharacterArmature|HitRecieve"
  | "CharacterArmature|HitRecieve_2"
  | "CharacterArmature|Idle"
  | "CharacterArmature|Idle_Gun"
  | "CharacterArmature|Idle_Gun_Pointing"
  | "CharacterArmature|Idle_Gun_Shoot"
  | "CharacterArmature|Idle_Neutral"
  | "CharacterArmature|Idle_Sword"
  | "CharacterArmature|Interact"
  | "CharacterArmature|Kick_Left"
  | "CharacterArmature|Kick_Right"
  | "CharacterArmature|Punch_Left"
  | "CharacterArmature|Punch_Right"
  | "CharacterArmature|Roll"
  | "CharacterArmature|Run"
  | "CharacterArmature|Run_Back"
  | "CharacterArmature|Run_Left"
  | "CharacterArmature|Run_Right"
  | "CharacterArmature|Run_Shoot"
  | "CharacterArmature|Sword_Slash"
  | "CharacterArmature|Walk"
  | "CharacterArmature|Wave";

interface Props extends GroupProps {
  hairColor: string;
  topColor: string;
  bottomColor: string;
}

export default function HoodieCharacter({
  hairColor = "pink",
  topColor = "red",
  bottomColor = "brown",
  ...props
}: Props) {
  const group = useRef<THREE.Group>(null);
  const { scene, materials, animations } = useGLTF("/models/HoodieCharacter.glb") as GLTFResult;

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const { actions } = useAnimations(animations, group);

  const [currentAnim, setCurrentAnim] = useState<ActionName>("CharacterArmature|Idle");

  useEffect(() => {
    actions[currentAnim]?.reset().fadeIn(0.5).play();

    return () => {
      actions[currentAnim]?.fadeOut(0.5);
    };
  }, [actions, currentAnim]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group name="CharacterArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Root} />
          </group>
          <group name="Casual_Feet" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Feet_1"
              geometry={(nodes.Casual_Feet_1 as THREE.SkinnedMesh).geometry}
              material={materials.White}
              skeleton={(nodes.Casual_Feet_1 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Casual_Feet_2"
              geometry={(nodes.Casual_Feet_2 as THREE.SkinnedMesh).geometry}
              material={materials.Purple}
              skeleton={(nodes.Casual_Feet_2 as THREE.SkinnedMesh).skeleton}
            />
          </group>
          <group name="Casual_Legs" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Legs_1"
              geometry={(nodes.Casual_Legs_1 as THREE.SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Casual_Legs_1 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Casual_Legs_2"
              geometry={(nodes.Casual_Legs_2 as THREE.SkinnedMesh).geometry}
              material={materials.LightBlue}
              skeleton={(nodes.Casual_Legs_2 as THREE.SkinnedMesh).skeleton}
            >
              <meshStandardMaterial color={bottomColor} />
            </skinnedMesh>
          </group>
          <group name="Casual_Head" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Head_1"
              geometry={(nodes.Casual_Head_1 as THREE.SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Casual_Head_1 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Casual_Head_2"
              geometry={(nodes.Casual_Head_2 as THREE.SkinnedMesh).geometry}
              material={materials.Eyebrows}
              skeleton={(nodes.Casual_Head_2 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Casual_Head_3"
              geometry={(nodes.Casual_Head_3 as THREE.SkinnedMesh).geometry}
              material={materials.Eye}
              skeleton={(nodes.Casual_Head_3 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Casual_Head_4"
              geometry={(nodes.Casual_Head_4 as THREE.SkinnedMesh).geometry}
              material={materials.Hair}
              skeleton={(nodes.Casual_Head_4 as THREE.SkinnedMesh).skeleton}
            >
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>
          </group>
          <group name="Casual_Body" position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Body_1"
              geometry={(nodes.Casual_Body_1 as THREE.SkinnedMesh).geometry}
              material={materials.Purple}
              skeleton={(nodes.Casual_Body_1 as THREE.SkinnedMesh).skeleton}
            >
              <meshStandardMaterial color={topColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Body_2"
              geometry={(nodes.Casual_Body_2 as THREE.SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Casual_Body_2 as THREE.SkinnedMesh).skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/HoodieCharacter.glb");
