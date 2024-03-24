import { EOperadorFilter } from 'src/app/enums/EOperadorFilter'
import { TypeFilter } from 'src/app/enums/TypeFilter'

export interface Filter{
   Value: string,
   Type: TypeFilter,
   Field: string,
   EOperadorFilter: EOperadorFilter
}
