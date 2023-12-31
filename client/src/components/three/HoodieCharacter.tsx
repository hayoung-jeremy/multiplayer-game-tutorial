/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTF, SkeletonUtils } from "three-stdlib";
import { useGraph, GroupProps, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { userAtom } from "../jotai/users";
import { useGrid } from "@/hooks";

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
  userId: string;
  hairColor: string;
  topColor: string;
  bottomColor: string;
  path: [number, number][];
}

const MOVEMENT_SPEED = 0.032;

export default function HoodieCharacter({
  userId,
  hairColor = "pink",
  topColor = "red",
  bottomColor = "brown",
  path,
  ...props
}: Props) {
  const group = useRef<THREE.Group>(null);
  const { scene, materials, animations } = useGLTF("/models/HoodieCharacter.glb") as GLTFResult;
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  const position = useMemo(() => props.position, []);

  const [currentAnim, setCurrentAnim] = useState<ActionName>("CharacterArmature|Idle");
  const user = useAtomValue(userAtom);

  const { gridToVector3 } = useGrid();
  const [gamePath, setGamePath] = useState<THREE.Vector3[]>();

  useEffect(() => {
    const newPath: THREE.Vector3[] = [];
    if (!path) return;
    path?.forEach(gridPosition => {
      newPath.push(gridToVector3(gridPosition));
    });
    setGamePath(newPath);
  }, [path]);

  useEffect(() => {
    actions[currentAnim]?.reset().fadeIn(0.32).play();

    return () => {
      actions[currentAnim]?.fadeOut(0.32);
    };
  }, [actions, currentAnim]);

  useFrame(state => {
    const character = group.current;
    const characterPos = props.position as THREE.Vector3;

    if (!character || characterPos === undefined || !user || !gamePath) return;

    if (gamePath?.length && character.position.distanceTo(gamePath[0]) > 0.1) {
      const direction = character.position.clone().sub(gamePath[0]).normalize().multiplyScalar(MOVEMENT_SPEED);
      character.position.sub(direction);
      character.lookAt(gamePath[0]);
      setCurrentAnim("CharacterArmature|Walk");
    } else if (gamePath.length) {
      gamePath.shift();
    } else {
      setCurrentAnim("CharacterArmature|Idle");
    }

    if (userId === user) {
      state.camera.position.x = character.position.x + 8;
      state.camera.position.y = character.position.y + 8;
      state.camera.position.z = character.position.z + 8;
      state.camera.lookAt(character.position);
    }
  });

  return (
    <group ref={group} {...props} name={`character-${userId}`} position={position} dispose={null}>
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
              castShadow
            />
            <skinnedMesh
              name="Casual_Feet_2"
              geometry={(nodes.Casual_Feet_2 as THREE.SkinnedMesh).geometry}
              material={materials.Purple}
              skeleton={(nodes.Casual_Feet_2 as THREE.SkinnedMesh).skeleton}
              castShadow
            />
          </group>
          <group name="Casual_Legs" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Legs_1"
              geometry={(nodes.Casual_Legs_1 as THREE.SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Casual_Legs_1 as THREE.SkinnedMesh).skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Legs_2"
              geometry={(nodes.Casual_Legs_2 as THREE.SkinnedMesh).geometry}
              material={materials.LightBlue}
              skeleton={(nodes.Casual_Legs_2 as THREE.SkinnedMesh).skeleton}
              castShadow
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
              castShadow
            />
            <skinnedMesh
              name="Casual_Head_2"
              geometry={(nodes.Casual_Head_2 as THREE.SkinnedMesh).geometry}
              material={materials.Eyebrows}
              skeleton={(nodes.Casual_Head_2 as THREE.SkinnedMesh).skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Head_3"
              geometry={(nodes.Casual_Head_3 as THREE.SkinnedMesh).geometry}
              material={materials.Eye}
              skeleton={(nodes.Casual_Head_3 as THREE.SkinnedMesh).skeleton}
              castShadow
            />
            <skinnedMesh
              name="Casual_Head_4"
              geometry={(nodes.Casual_Head_4 as THREE.SkinnedMesh).geometry}
              material={materials.Hair}
              skeleton={(nodes.Casual_Head_4 as THREE.SkinnedMesh).skeleton}
              castShadow
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
              castShadow
            >
              <meshStandardMaterial color={topColor} />
            </skinnedMesh>
            <skinnedMesh
              name="Casual_Body_2"
              geometry={(nodes.Casual_Body_2 as THREE.SkinnedMesh).geometry}
              material={materials.Skin}
              skeleton={(nodes.Casual_Body_2 as THREE.SkinnedMesh).skeleton}
              castShadow
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/HoodieCharacter.glb");
