import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { useSceneStore } from '@/stores/sceneStore'
import { tierConfig } from '@/lib/quality'

const CA_OFFSET: [number, number] = [0.0007, 0.0009]

export function Effects() {
  const tier = useSceneStore((s) => s.tier)
  const cfg = tierConfig(tier)

  if (tier === 'static') return null

  return (
    <EffectComposer multisampling={0} enableNormalPass={false} stencilBuffer={false}>
      {cfg.bloom ? (
        <Bloom
          intensity={0.65}
          luminanceThreshold={0.32}
          luminanceSmoothing={0.45}
          mipmapBlur={cfg.bloomMipmap}
          resolutionScale={cfg.bloomScale}
        />
      ) : (
        <></>
      )}
      <ChromaticAberration offset={CA_OFFSET} />
      <Vignette eskil={false} offset={0.22} darkness={0.7} />
    </EffectComposer>
  )
}
