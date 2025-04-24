import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from './carousel-buttons'

const Carousel = ({ tabs }: { tabs: string[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  React.useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()) // Access API
    }
  }, [emblaApi])

  return (
    <div className="overflow-hidden mt-[20px]" ref={emblaRef}>
      <div className="flex">
        {tabs.map((tab, i) => (
          <div className='min-w-0 flex-[0_0_100%] border' key={i}>
            {tab}
          </div>
        ))}
      </div>

      <div className="flex gap-[2px] mt-[5px] flex-wrap justify-center items-center -mr-[calc((2.6rem-1.4rem)/2)]">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`appearance-none bg-transparent touch-manipulation inline-flex items-center justify-center cursor-pointer border-0 p-0 m-0 w-[10px] h-[10px] rounded-full ${index === selectedIndex ? 'shadow-[inset_0_0_0_0.2rem_#0A6B41]' : 'shadow-[inset_0_0_0_0.2rem_#7BAF9A]'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
