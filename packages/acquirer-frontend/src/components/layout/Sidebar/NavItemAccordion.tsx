import { NavLink, useLocation } from 'react-router-dom'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Icon,
  Link,
} from '@chakra-ui/react'

import type { NavItemAccordion as NavItemAccordionType } from './navItems'
import TooltipShell from './TooltipShell'

interface NavItemAccordionProps {
  navItemAccordion: NavItemAccordionType
}

const NavItemAccordion = ({ navItemAccordion }: NavItemAccordionProps) => {
  const location = useLocation()

  const { tooltipLabel, label, icon, subNavItems } = navItemAccordion

  return (
    <Accordion allowToggle>
      <AccordionItem border='0' display='flex' flexDir='column' alignItems='center'>
        <TooltipShell label={tooltipLabel}>
          <AccordionButton
            p='0'
            aria-label={label}
            h='10'
            w='10'
            display='flex'
            alignItems='center'
            justifyContent='center'
            bg='transparent'
            fontSize='20px'
            color='primary'
            _hover={{ bg: 'secondary' }}
            rounded='md'
          >
            <Icon as={icon} />
          </AccordionButton>
        </TooltipShell>

        <AccordionPanel
          p='0'
          px='1'
          pb='1'
          mt='4'
          display='flex'
          flexDir='column'
          alignItems='center'
          gap='4'
        >
          {subNavItems.map(({ tooltipLabel, name, to }) => (
            <TooltipShell key={tooltipLabel} label={tooltipLabel}>
              <Link
                as={NavLink}
                to={to}
                w='20'
                py='1.5'
                bg={location.pathname === to ? 'secondary' : 'transparent'}
                textAlign='center'
                fontSize='sm'
                fontWeight='medium'
                rounded='md'
                _hover={{ bg: 'secondary' }}
              >
                {name}
              </Link>
            </TooltipShell>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default NavItemAccordion
