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
          intensity={0.55}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.4}
          mipmapBlur
          resolutionScale={cfg.bloomScale}
        />
      ) : (
        <></>
      )}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0006, 0.0008)}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.65} />
    </EffectComposer>
  )
}
