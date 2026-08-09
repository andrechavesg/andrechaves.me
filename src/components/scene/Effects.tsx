import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useSceneStore } from '@/stores/sceneStore'
import { tierConfig } from '@/lib/quality'
import { Vector2 } from 'three'

export function Effects() {
  const tier = useSceneStore((s) => s.tier)
  const cfg = tierConfig(tier)
  if (tier === 'static') return null

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {cfg.bloom ? (
        <Bloom
          intensity={0.72}
          luminanceThreshold={0.28}
          luminanceSmoothing={0.45}
          mipmapBlur
          resolutionScale={cfg.bloomScale}
        />
      ) : (
        <></>
      )}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0007, 0.0009)}
      />
      <Vignette eskil={false} offset={0.22} darkness={0.7} />
    </EffectComposer>
  )
}
