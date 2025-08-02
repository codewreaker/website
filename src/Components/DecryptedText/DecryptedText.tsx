import { useEffect, useState, useRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

const styles = {
    wrapper: {
        display: 'inline-block',
        whiteSpace: 'pre-wrap',
    },
    srOnly: {
        position: 'absolute' as 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        border: 0,
    },
}

interface DecryptedTextProps extends HTMLMotionProps<'span'> {
    text: string
    speed?: number
    maxIterations?: number
    sequential?: boolean
    revealDirection?: 'start' | 'end' | 'center'
    useOriginalCharsOnly?: boolean
    characters?: string
    className?: string
    parentClassName?: string
    encryptedClassName?: string
    animateOn?: 'view' | 'hover'
    delay?: number | { time: number; after: boolean } // Enhanced delay prop
}

export default function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = '{}[]()<>=!&|+-*/%^~`?:;.,_0123456789ABCDEFGHIJKLMNOPabcdefghijklmnop',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
    delay = 0, // Default to no delay, can be number or {time, after}
    ...props
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState<string>(text)
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const [isScrambling, setIsScrambling] = useState<boolean>(false)
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
    const [hasAnimated, setHasAnimated] = useState<boolean>(false)
    const [shouldStartAnimation, setShouldStartAnimation] = useState<boolean>(false)
    const [showOriginalFirst, setShowOriginalFirst] = useState<boolean>(false)
    const containerRef = useRef<HTMLSpanElement>(null)
    const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Parse delay configuration
    const delayConfig = typeof delay === 'number' 
        ? { time: delay, after: false } 
        : { time: delay?.time || 0, after: delay?.after || false }

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let currentIteration = 0

        const getNextIndex = (revealedSet: Set<number>): number => {
            const textLength = text.length
            switch (revealDirection) {
                case 'start':
                    return revealedSet.size
                case 'end':
                    return textLength - 1 - revealedSet.size
                case 'center': {
                    const middle = Math.floor(textLength / 2)
                    const offset = Math.floor(revealedSet.size / 2)
                    const nextIndex =
                        revealedSet.size % 2 === 0
                            ? middle + offset
                            : middle - offset - 1

                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                        return nextIndex
                    }

                    for (let i = 0; i < textLength; i++) {
                        if (!revealedSet.has(i)) return i
                    }
                    return 0
                }
                default:
                    return revealedSet.size
            }
        }

        const availableChars = useOriginalCharsOnly
            ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
            : characters.split('')

        const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
            if (useOriginalCharsOnly) {
                const positions = originalText.split('').map((char, i) => ({
                    char,
                    isSpace: char === ' ',
                    index: i,
                    isRevealed: currentRevealed.has(i),
                }))

                const nonSpaceChars = positions
                    .filter((p) => !p.isSpace && !p.isRevealed)
                    .map((p) => p.char)

                for (let i = nonSpaceChars.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1))
                    ;[nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]]
                }

                let charIndex = 0
                return positions
                    .map((p) => {
                        if (p.isSpace) return ' '
                        if (p.isRevealed) return originalText[p.index]
                        return nonSpaceChars[charIndex++]
                    })
                    .join('')
            } else {
                return originalText
                    .split('')
                    .map((char, i) => {
                        if (char === ' ') return ' '
                        if (currentRevealed.has(i)) return originalText[i]
                        return availableChars[Math.floor(Math.random() * availableChars.length)]
                    })
                    .join('')
            }
        }

        // Only start scrambling if shouldStartAnimation is true
        if (isHovering && shouldStartAnimation && !showOriginalFirst) {
            setIsScrambling(true)
            interval = setInterval(() => {
                setRevealedIndices((prevRevealed) => {
                    if (sequential) {
                        if (prevRevealed.size < text.length) {
                            const nextIndex = getNextIndex(prevRevealed)
                            const newRevealed = new Set(prevRevealed)
                            newRevealed.add(nextIndex)
                            setDisplayText(shuffleText(text, newRevealed))
                            return newRevealed
                        } else {
                            clearInterval(interval)
                            setIsScrambling(false)
                            return prevRevealed
                        }
                    } else {
                        setDisplayText(shuffleText(text, prevRevealed))
                        currentIteration++
                        if (currentIteration >= maxIterations) {
                            clearInterval(interval)
                            setIsScrambling(false)
                            setDisplayText(text)
                        }
                        return prevRevealed
                    }
                })
            }, speed)
        } else if (!isHovering) {
            setDisplayText(text)
            setRevealedIndices(new Set())
            setIsScrambling(false)
            setShouldStartAnimation(false)
            setShowOriginalFirst(false)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [
        isHovering,
        shouldStartAnimation,
        showOriginalFirst,
        text,
        speed,
        maxIterations,
        sequential,
        revealDirection,
        characters,
        useOriginalCharsOnly,
    ])

    // Handle delay when animation should start
    useEffect(() => {
        if (isHovering && !shouldStartAnimation) {
            if (delayConfig.time > 0) {
                if (delayConfig.after) {
                    // Show original text first, then start scrambling after delay
                    setShowOriginalFirst(true)
                    setDisplayText(text)
                    delayTimeoutRef.current = setTimeout(() => {
                        setShowOriginalFirst(false)
                        setShouldStartAnimation(true)
                    }, delayConfig.time)
                } else {
                    // Wait for delay before starting scrambling (no original text shown)
                    delayTimeoutRef.current = setTimeout(() => {
                        setShouldStartAnimation(true)
                    }, delayConfig.time)
                }
            } else {
                setShouldStartAnimation(true)
            }
        }

        return () => {
            if (delayTimeoutRef.current) {
                clearTimeout(delayTimeoutRef.current)
                delayTimeoutRef.current = null
            }
        }
    }, [isHovering, delayConfig.time, delayConfig.after, text])

    useEffect(() => {
        if (animateOn !== 'view') return

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setIsHovering(true)
                    setHasAnimated(true)
                }
            })
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)
        const currentRef = containerRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [animateOn, hasAnimated])

    const hoverProps =
        animateOn === 'hover'
            ? {
                onMouseEnter: () => setIsHovering(true),
                onMouseLeave: () => setIsHovering(false),
            }
            : {}

    return (
        <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...hoverProps} {...props}>
            <span style={styles.srOnly}>{displayText}</span>

            <span aria-hidden="true">
                {displayText.split('').map((char, index) => {
                    const isRevealedOrDone =
                        revealedIndices.has(index) || !isScrambling || !isHovering

                    return (
                        <span
                            key={index}
                            className={isRevealedOrDone ? className : encryptedClassName}
                        >
                            {char}
                        </span>
                    )
                })}
            </span>
        </motion.span>
    )
}